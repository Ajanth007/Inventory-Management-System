
const db = require("../config/db");
const auditLog = require("../utils/auditLog");

exports.listMovements = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT
        sm.*,
        p.name AS product_name,
        p.sku
       FROM stock_movements sm
       JOIN products p ON p.id = sm.product_id
       WHERE sm.company_id = ?
       ORDER BY sm.id DESC`,
      [req.user.company_id]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.adjustStock = async (req, res, next) => {
  const conn = await db.getConnection();

  try {
    const {
      product_id,
      qty,
      note
    } = req.body;

    if (!product_id || !Number.isInteger(Number(qty)) ||
        Number(qty) === 0) {
      return res.status(400).json({
        success: false,
        message: "Product and non-zero integer quantity are required"
      });
    }

    const quantity = Number(qty);

    await conn.beginTransaction();

    const [products] = await conn.query(
      `SELECT id, stock_qty
       FROM products
       WHERE id = ? AND company_id = ?
       FOR UPDATE`,
      [product_id, req.user.company_id]
    );

    if (!products.length) {
      throw Object.assign(new Error("Product not found"), { status: 404 });
    }

    const newStock =
      Number(products[0].stock_qty) + quantity;

    if (newStock < 0) {
      throw Object.assign(new Error("Stock cannot become negative"), { status: 400 });
    }

    await conn.query(
      `UPDATE products
       SET stock_qty = ?
       WHERE id = ? AND company_id = ?`,
      [newStock, product_id, req.user.company_id]
    );

    await conn.query(
      `INSERT INTO stock_movements
       (company_id, product_id, type, qty,
        reference_type, note, created_by)
       VALUES (?, ?, 'adjustment', ?, 'manual', ?, ?)`,
      [
        req.user.company_id,
        product_id,
        quantity,
        note || "Manual stock adjustment",
        req.user.id
      ]
    );

    await conn.commit();

    await auditLog({
      companyId: req.user.company_id,
      userId: req.user.id,
      action: "update",
      entityType: "product",
      entityId: product_id,
      details: "Manual stock adjustment",
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: "Stock adjusted successfully",
      stock: newStock
    });

  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};
