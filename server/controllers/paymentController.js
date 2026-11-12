
const db = require("../config/db");
const auditLog = require("../utils/auditLog");

exports.listPayments = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.name AS customer, i.number AS invoice_number
       FROM payments p
       JOIN customers c ON c.id = p.customer_id
       JOIN invoices i ON i.id = p.invoice_id
       WHERE p.company_id = ?
       ORDER BY p.id DESC`,
      [req.user.company_id]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.createPayment = async (req, res, next) => {
  const conn = await db.getConnection();

  try {
    const {
      invoice_id,
      reference,
      method,
      amount,
      paid_at
    } = req.body;

    const paymentAmount = Number(amount);

    if (!invoice_id || !reference ||
        !["cash", "transfer", "card"].includes(method) ||
        !Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment information"
      });
    }

    await conn.beginTransaction();

    const [invoices] = await conn.query(
      `SELECT * FROM invoices
       WHERE id = ? AND company_id = ?
       FOR UPDATE`,
      [invoice_id, req.user.company_id]
    );

    if (!invoices.length) {
      throw Object.assign(new Error("Invoice not found"), { status: 404 });
    }

    const invoice = invoices[0];

    if (invoice.status === "cancelled") {
      throw Object.assign(new Error("Cannot pay a cancelled invoice"), { status: 409 });
    }

    const outstanding = Number(invoice.total) - Number(invoice.paid_amount);

    if (paymentAmount > outstanding + 0.0001) {
      throw Object.assign(new Error("Payment exceeds outstanding invoice amount"), { status: 400 });
    }

    const [result] = await conn.query(
      `INSERT INTO payments
       (company_id, invoice_id, customer_id, reference,
        method, amount, paid_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.company_id,
        invoice.id,
        invoice.customer_id,
        reference,
        method,
        paymentAmount,
        paid_at || new Date(),
        req.user.id
      ]
    );

    const newPaidAmount =
      Number(invoice.paid_amount) + paymentAmount;

    const newStatus =
      newPaidAmount >= Number(invoice.total) - 0.0001
        ? "paid"
        : "partial";

    await conn.query(
      `UPDATE invoices
       SET paid_amount = ?, status = ?
       WHERE id = ? AND company_id = ?`,
      [
        newPaidAmount,
        newStatus,
        invoice.id,
        req.user.company_id
      ]
    );

    if (invoice.sale_id) {
      const [otherInvoices] = await conn.query(
        `SELECT
          COALESCE(SUM(total), 0) AS total,
          COALESCE(SUM(paid_amount), 0) AS paid
         FROM invoices
         WHERE sale_id = ?
           AND company_id = ?
           AND status != 'cancelled'`,
        [invoice.sale_id, req.user.company_id]
      );

      const salePaymentStatus =
        Number(otherInvoices[0].paid) <= 0
          ? "pending"
          : Number(otherInvoices[0].paid) >= Number(otherInvoices[0].total) - 0.0001
            ? "paid"
            : "partial";

      await conn.query(
        `UPDATE sales
         SET payment_status = ?
         WHERE id = ? AND company_id = ?`,
        [
          salePaymentStatus,
          invoice.sale_id,
          req.user.company_id
        ]
      );
    }

    await conn.commit();

    await auditLog({
      companyId: req.user.company_id,
      userId: req.user.id,
      action: "create",
      entityType: "payment",
      entityId: result.insertId,
      details: "Payment received",
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      id: result.insertId,
      paidAmount: newPaidAmount,
      invoiceStatus: newStatus
    });

  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};
