
const db = require("../config/db");
const auditLog = require("../utils/auditLog");

exports.listInvoices = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT i.*, c.name AS customer
       FROM invoices i
       JOIN customers c ON c.id = i.customer_id
       WHERE i.company_id = ?
       ORDER BY i.id DESC`,
      [req.user.company_id]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.createInvoice = async (req, res, next) => {
  const conn = await db.getConnection();

  try {
    const {
      sale_id,
      customer_id,
      number,
      issued_at,
      due_date,
      total
    } = req.body;

    if (!customer_id || !number || !issued_at || !due_date ||
        !Number.isFinite(Number(total)) || Number(total) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid customer, number, dates and total are required"
      });
    }

    if (due_date < issued_at) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be before issue date"
      });
    }

    await conn.beginTransaction();

    const [customers] = await conn.query(
      `SELECT id FROM customers
       WHERE id = ? AND company_id = ?`,
      [customer_id, req.user.company_id]
    );

    if (!customers.length) {
      throw Object.assign(new Error("Customer not found"), { status: 400 });
    }

    if (sale_id) {
      const [sales] = await conn.query(
        `SELECT id, customer_id, total, status
         FROM sales
         WHERE id = ? AND company_id = ?
         FOR UPDATE`,
        [sale_id, req.user.company_id]
      );

      if (!sales.length ||
          sales[0].customer_id !== Number(customer_id) ||
          sales[0].status === "cancelled" ||
          Math.abs(Number(sales[0].total) - Number(total)) > 0.01) {
        throw Object.assign(new Error("Invalid invoice sale"), { status: 400 });
      }

      const [existing] = await conn.query(
        "SELECT id FROM invoices WHERE sale_id = ?",
        [sale_id]
      );

      if (existing.length) {
        throw Object.assign(new Error("An invoice already exists for this sale"), { status: 409 });
      }
    }

    const [result] = await conn.query(
      `INSERT INTO invoices
       (company_id, sale_id, customer_id, number,
        issued_at, due_date, total, paid_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'pending')`,
      [
        req.user.company_id,
        sale_id || null,
        customer_id,
        number,
        issued_at,
        due_date,
        total
      ]
    );

    await conn.commit();

    await auditLog({
      companyId: req.user.company_id,
      userId: req.user.id,
      action: "create",
      entityType: "invoice",
      entityId: result.insertId,
      details: "Invoice created",
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: "Invoice created",
      id: result.insertId
    });

  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};
