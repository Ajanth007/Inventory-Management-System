
const {pool} = require("../config/db");
const auditLog = require("../utils/auditLog");


exports.listPurchases = async (req, res, next) => {
  try {
    console.log("========== LIST PURCHASES ==========");
    console.log("Company ID:", req.user.company_id);

    const [rows] = await pool.query(
      `SELECT
          p.id,
          p.company_id,
          p.supplier_id,
          p.number,
          p.purchase_date,
          p.subtotal,
          p.tax,
          p.total,
          p.status,
          p.received_at,
          p.created_at,
          s.name AS supplier,
          COALESCE(
            JSON_ARRAYAGG(
              CASE
                WHEN pi.id IS NOT NULL THEN
                  JSON_OBJECT(
                    'id', pi.id,
                    'product_id', pi.product_id,
                    'product_name', pr.name,
                    'qty', pi.qty,
                    'unit_cost', pi.unit_cost,
                    'line_total', pi.line_total
                  )
                ELSE NULL
              END
            ),
            JSON_ARRAY()
          ) AS items
       FROM purchases p
       JOIN suppliers s ON s.id = p.supplier_id
       LEFT JOIN purchase_items pi ON pi.purchase_id = p.id
       LEFT JOIN products pr ON pr.id = pi.product_id
       WHERE p.company_id = ?
       GROUP BY p.id
       ORDER BY p.id DESC`,
      [req.user.company_id]
    );

    console.log("Purchases fetched:", rows.length);

    res.json(rows);

  } catch (error) {
    console.error("LIST PURCHASES ERROR:", error);
    next(error);
  }
};


exports.createPurchase = async (req, res, next) => {
  const conn = await pool.getConnection();

  try {
    const {
      supplier_id,
      number,
      purchase_date,
      tax = 0,
      items
    } = req.body;

    if (!supplier_id || !purchase_date ||
        !Array.isArray(items) || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Supplier, date and purchase items are required"
      });
    }

    if (!Number.isFinite(Number(tax)) || Number(tax) < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid tax amount"
      });
    }

    await conn.beginTransaction();

    const [supplier] = await conn.query(
      `SELECT id FROM suppliers
       WHERE id = ? AND company_id = ? AND status = 'active'`,
      [supplier_id, req.user.company_id]
    );

    if (!supplier.length) {
      throw Object.assign(new Error("Invalid supplier"), { status: 400 });
    }

    let subtotal = 0;

    for (const item of items) {
      const qty = Number(item.qty);
      const unitCost = Number(item.unit_cost);

      if (!Number.isInteger(qty) || qty <= 0 ||
          !Number.isFinite(unitCost) || unitCost < 0) {
        throw Object.assign(new Error("Invalid purchase item"), { status: 400 });
      }

      const [product] = await conn.query(
        `SELECT id FROM products
         WHERE id = ? AND company_id = ?`,
        [item.product_id, req.user.company_id]
      );

      if (!product.length) {
        throw Object.assign(new Error("Invalid product"), { status: 400 });
      }

      subtotal += qty * unitCost;
    }

    const total = subtotal + Number(tax);

    const [result] = await conn.query(
      `INSERT INTO purchases
       (company_id, supplier_id, number, purchase_date,
        subtotal, tax, total, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
      [
        req.user.company_id,
        supplier_id,
        number,
        purchase_date,
        subtotal,
        tax,
        total,
        req.user.id
      ]
    );

    for (const item of items) {
      await conn.query(
        `INSERT INTO purchase_items
         (purchase_id, product_id, qty, unit_cost)
         VALUES (?, ?, ?, ?)`,
        [
          result.insertId,
          item.product_id,
          item.qty,
          item.unit_cost
        ]
      );
    }

    await conn.commit();

    await auditLog({
      companyId: req.user.company_id,
      userId: req.user.id,
      action: "create",
      entityType: "purchase",
      entityId: result.insertId,
      details: "Purchase created",
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: "Purchase created",
      id: result.insertId
    });

  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};

exports.receivePurchase = async (req, res, next) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [purchases] = await conn.query(
      `SELECT * FROM purchases
       WHERE id = ? AND company_id = ?
       FOR UPDATE`,
      [req.params.id, req.user.company_id]
    );

    if (!purchases.length) {
      throw Object.assign(new Error("Purchase not found"), { status: 404 });
    }

    const purchase = purchases[0];

    if (!["draft", "ordered"].includes(purchase.status)) {
      throw Object.assign(new Error("Purchase cannot be received"), { status: 409 });
    }

    const [items] = await conn.query(
      `SELECT * FROM purchase_items
       WHERE purchase_id = ?`,
      [purchase.id]
    );

    if (!items.length) {
      throw Object.assign(new Error("Purchase has no items"), { status: 400 });
    }

    for (const item of items) {
      const [products] = await conn.query(
        `SELECT id FROM products
         WHERE id = ? AND company_id = ?
         FOR UPDATE`,
        [item.product_id, req.user.company_id]
      );

      if (!products.length) {
        throw Object.assign(new Error("Invalid product in purchase"), { status: 400 });
      }

      await conn.query(
        `UPDATE products
         SET stock_qty = stock_qty + ?
         WHERE id = ? AND company_id = ?`,
        [item.qty, item.product_id, req.user.company_id]
      );

      await conn.query(
        `INSERT INTO stock_movements
         (company_id, product_id, type, qty,
          reference_type, reference_id, note, created_by)
         VALUES (?, ?, 'in', ?, 'purchase', ?, ?, ?)`,
        [
          req.user.company_id,
          item.product_id,
          item.qty,
          purchase.id,
          "Purchase received",
          req.user.id
        ]
      );
    }

    await conn.query(
      `UPDATE purchases
       SET status = 'received', received_at = NOW()
       WHERE id = ? AND company_id = ?`,
      [purchase.id, req.user.company_id]
    );

    await conn.commit();

    await auditLog({
      companyId: req.user.company_id,
      userId: req.user.id,
      action: "update",
      entityType: "purchase",
      entityId: purchase.id,
      details: "Purchase received",
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: "Purchase received and stock updated"
    });

  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};
