
const {pool} = require("../config/db");
const auditLog = require("../utils/auditLog");

const resources = {
  products: {
    table: "products",
    fields: [
      "category_id", "sku", "name",
      "cost_price", "sale_price", "stock_qty",
      "min_stock", "target_stock", "status"
    ],
    search: ["name", "sku"]
  },

  categories: {
    table: "categories",
    fields: ["name", "description", "status"],
    search: ["name", "description"]
  },

  suppliers: {
    table: "suppliers",
    fields: [
      "name", "contact", "email",
      "phone", "country", "status"
    ],
    search: ["name", "email"]
  },

  customers: {
    table: "customers",
    fields: [
      "name", "email", "phone",
      "city", "tax_id", "status"
    ],
    search: ["name", "email", "phone"]
  },

  expenses: {
    table: "expenses",
    fields: [
      "expense_date", "category",
      "description", "vendor", "amount", "status"
    ],
    search: ["description", "vendor"]
  }
};

const getConfig = (name) => {
  const config = resources[name];

  if (!config) {
    const error = new Error("Resource not found");
    error.status = 404;
    throw error;
  }

  return config;
};

exports.listResource = async (req, res, next) => {
  try {
    const config = getConfig(req.params.resource);

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 100));
    const offset = (page - 1) * limit;

    const conditions = ["company_id = ?"];
    const values = [req.user.company_id];

    if (req.query.search) {
      const search = config.search
        .map(field => `${field} LIKE ?`)
        .join(" OR ");

      conditions.push(`(${search})`);

      config.search.forEach(() => {
        values.push(`%${req.query.search}%`);
      });
    }

    if (req.query.status && config.fields.includes("status")) {
      conditions.push("status = ?");
      values.push(req.query.status);
    }

    const where = conditions.join(" AND ");

    const allowedSort = {
      products: ["id", "name", "sku", "sale_price", "stock_qty", "created_at"],
      categories: ["id", "name", "created_at"],
      customers: ["id", "name", "created_at"],
      suppliers: ["id", "name", "created_at"],
      expenses: ["id", "expense_date", "amount", "created_at"]
    };

    const sort = allowedSort[req.params.resource].includes(req.query.sort)
      ? req.query.sort
      : "id";

    const order = req.query.order === "asc" ? "ASC" : "DESC";

    const [rows] = await pool.query(
      `SELECT * FROM ${config.table}
       WHERE ${where}
       ORDER BY ${sort} ${order}
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const [[count]] = await pool.query(
      `SELECT COUNT(*) AS total FROM ${config.table}
       WHERE ${where}`,
      values
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count.total,
        totalPages: Math.ceil(count.total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.getResource = async (req, res, next) => {
  try {
    const config = getConfig(req.params.resource);

    const [rows] = await pool.query(
      `SELECT * FROM ${config.table}
       WHERE id = ? AND company_id = ?`,
      [req.params.id, req.user.company_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    next(error);
  }
};

exports.createResource = async (req, res, next) => {
  try {
    const config = getConfig(req.params.resource);

    const fields = config.fields.filter(
      field => req.body[field] !== undefined
    );

    if (!fields.length) {
      return res.status(400).json({
        success: false,
        message: "No valid fields supplied"
      });
    }

    const values = fields.map(field => req.body[field]);

    const columns = [...fields, "company_id"];

    const [result] = await pool.query(
      `INSERT INTO ${config.table}
       (${columns.join(", ")})
       VALUES (${columns.map(() => "?").join(", ")})`,
      [...values, req.user.company_id]
    );

    const [rows] = await pool.query(
      `SELECT * FROM ${config.table}
       WHERE id = ? AND company_id = ?`,
      [result.insertId, req.user.company_id]
    );

    await auditLog({
      companyId: req.user.company_id,
      userId: req.user.id,
      action: "create",
      entityType: req.params.resource,
      entityId: result.insertId,
      details: "Record created",
      newValues: rows[0],
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    next(error);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    const config = getConfig(req.params.resource);

    const fields = config.fields.filter(
      field => req.body[field] !== undefined
    );

    if (!fields.length) {
      return res.status(400).json({
        success: false,
        message: "No valid fields supplied"
      });
    }

    const [oldRows] = await pool.query(
      `SELECT * FROM ${config.table}
       WHERE id = ? AND company_id = ?`,
      [req.params.id, req.user.company_id]
    );

    if (!oldRows.length) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    const assignments = fields.map(
      field => `${field} = ?`
    ).join(", ");

    await pool.query(
      `UPDATE ${config.table}
       SET ${assignments}
       WHERE id = ? AND company_id = ?`,
      [
        ...fields.map(field => req.body[field]),
        req.params.id,
        req.user.company_id
      ]
    );

    const [rows] = await pool.query(
      `SELECT * FROM ${config.table}
       WHERE id = ? AND company_id = ?`,
      [req.params.id, req.user.company_id]
    );

    await auditLog({
      companyId: req.user.company_id,
      userId: req.user.id,
      action: "update",
      entityType: req.params.resource,
      entityId: req.params.id,
      details: "Record updated",
      oldValues: oldRows[0],
      newValues: rows[0],
      ipAddress: req.ip
    });

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    next(error);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const config = getConfig(req.params.resource);

    const [rows] = await pool.query(
      `SELECT * FROM ${config.table}
       WHERE id = ? AND company_id = ?`,
      [req.params.id, req.user.company_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    await pool.query(
      `DELETE FROM ${config.table}
       WHERE id = ? AND company_id = ?`,
      [req.params.id, req.user.company_id]
    );

    await auditLog({
      companyId: req.user.company_id,
      userId: req.user.id,
      action: "delete",
      entityType: req.params.resource,
      entityId: req.params.id,
      details: "Record deleted",
      oldValues: rows[0],
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: "Record deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};
