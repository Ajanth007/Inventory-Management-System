
const {pool} = require("../config/db");
const auditLog = require("../utils/auditLog");

exports.listSales = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, c.name AS customer
       FROM sales s
       JOIN customers c ON c.id = s.customer_id
       WHERE s.company_id = ?
       ORDER BY s.id DESC`,
      [req.user.company_id]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.createSale = async (req, res, next) => {
  const conn = await pool.getConnection();

  try {
    const {
      customer_id,
      number,
      sale_date,
      tax = 0,
      items
    } = req.body;

    if (!customer_id || !sale_date ||
        !Array.isArray(items) || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Customer, date and sale items are required"
      });
    }

    if (!Number.isFinite(Number(tax)) || Number(tax) < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid tax amount"
      });
    }

    await conn.beginTransaction();

    const [customers] = await conn.query(
      `SELECT id FROM customers
       WHERE id = ? AND company_id = ? AND status = 'active'`,
      [customer_id, req.user.company_id]
    );

    if (!customers.length) {
      throw Object.assign(new Error("Invalid customer"), { status: 400 });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const qty = Number(item.qty);
      const unitPrice = Number(item.unit_price);

      if (!Number.isInteger(qty) || qty <= 0 ||
          !Number.isFinite(unitPrice) || unitPrice < 0) {
        throw Object.assign(new Error("Invalid sale item"), { status: 400 });
      }

      const [products] = await conn.query(
        `SELECT id, stock_qty, cost_price
         FROM products
         WHERE id = ? AND company_id = ? AND status = 'active'
         FOR UPDATE`,
        [item.product_id, req.user.company_id]
      );

      if (!products.length) {
        throw Object.assign(new Error("Product not found"), { status: 400 });
      }

      if (products[0].stock_qty < qty) {
        throw Object.assign(new Error(
          `Insufficient stock for product ${item.product_id}`
        ), { status: 409 });
      }

      subtotal += qty * unitPrice;

      validatedItems.push({
        product_id: item.product_id,
        qty,
        unit_price: unitPrice,
        unit_cost: products[0].cost_price
      });
    }

    const total = subtotal + Number(tax);

    const [result] = await conn.query(
      `INSERT INTO sales
       (company_id, customer_id, number, sale_date,
        subtotal, tax, total, payment_status, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'confirmed', ?)`,
      [
        req.user.company_id,
        customer_id,
        number,
        sale_date,
        subtotal,
        tax,
        total,
        req.user.id
      ]
    );

    for (const item of validatedItems) {
      await conn.query(
        `INSERT INTO sale_items
         (sale_id, product_id, qty, unit_price, unit_cost)
         VALUES (?, ?, ?, ?, ?)`,
        [
          result.insertId,
          item.product_id,
          item.qty,
          item.unit_price,
          item.unit_cost
        ]
      );
    }

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      id: result.insertId
    });

  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};

exports.completeSale = async (req, res, next) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [sales] = await conn.query(
      `SELECT * FROM sales
       WHERE id = ? AND company_id = ?
       FOR UPDATE`,
      [req.params.id, req.user.company_id]
    );

    if (!sales.length) {
      throw Object.assign(new Error("Sale not found"), { status: 404 });
    }

    const sale = sales[0];

    if (sale.status !== "confirmed") {
      throw Object.assign(new Error("Sale cannot be completed"), { status: 409 });
    }

    const [items] = await conn.query(
      `SELECT * FROM sale_items WHERE sale_id = ?`,
      [sale.id]
    );

    if (!items.length) {
      throw Object.assign(new Error("Sale has no items"), { status: 400 });
    }

    for (const item of items) {
      const [products] = await conn.query(
        `SELECT stock_qty FROM products
         WHERE id = ? AND company_id = ?
         FOR UPDATE`,
        [item.product_id, req.user.company_id]
      );

      if (!products.length || products[0].stock_qty < item.qty) {
        throw Object.assign(new Error("Insufficient stock"), { status: 409 });
      }

      await conn.query(
        `UPDATE products
         SET stock_qty = stock_qty - ?
         WHERE id = ? AND company_id = ?`,
        [item.qty, item.product_id, req.user.company_id]
      );

      await conn.query(
        `INSERT INTO stock_movements
         (company_id, product_id, type, qty,
          reference_type, reference_id, note, created_by)
         VALUES (?, ?, 'out', ?, 'sale', ?, ?, ?)`,
        [
          req.user.company_id,
          item.product_id,
          -item.qty,
          sale.id,
          "Sale completed",
          req.user.id
        ]
      );
    }

    await conn.query(
      `UPDATE sales
       SET status = 'completed'
       WHERE id = ? AND company_id = ?`,
      [sale.id, req.user.company_id]
    );

    await conn.commit();

    await auditLog({
      companyId: req.user.company_id,
      userId: req.user.id,
      action: "update",
      entityType: "sale",
      entityId: sale.id,
      details: "Sale completed",
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: "Sale completed and inventory updated"
    });

  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};
