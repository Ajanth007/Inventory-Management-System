
const {pool} = require("../config/db");
const auditLog = require("../utils/auditLog");

// ========================================
// GET ALL USERS
// ========================================
exports.listUsers = async (req, res, next) => {
  try {
    console.log("\n========== LIST USERS ==========");
    console.log("Company ID:", req.user.company_id);

    const [rows] = await pool.query(
      `SELECT
          u.id,
          u.company_id,
          u.role_id,
          u.name,
          u.email,
          r.name AS role,
          u.status,
          u.last_login_at AS lastLogin,
          u.created_at,
          u.updated_at
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.company_id = ?
       ORDER BY u.id DESC`,
      [req.user.company_id]
    );

    console.log("Users fetched:", rows.length);

    res.json(rows);

  } catch (error) {
    console.error("LIST USERS ERROR:", error);
    next(error);
  }
};


// ========================================
// INVITE / CREATE USER
// ========================================
exports.createUser = async (req, res, next) => {
  try {
    console.log("\n========== CREATE USER ==========");
    console.log("Request body:", req.body);

    const { name, email, role } = req.body;
    const companyId = req.user.company_id;

    // Validate required fields
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email and role are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address"
      });
    }

    // Find role belonging to the current company
    const [roles] = await pool.query(
      `SELECT id, name
       FROM roles
       WHERE name = ? AND company_id = ?`,
      [role, companyId]
    );

    console.log("Role result:", roles);

    if (!roles.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid role for this company"
      });
    }

    const roleId = roles[0].id;

    // Check whether email already exists
    const [existingUsers] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      [normalizedEmail]
    );

    if (existingUsers.length) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists"
      });
    }

    // Create invited user
    const [result] = await pool.query(
      `INSERT INTO users
       (company_id, role_id, name, email, password_hash, status)
       VALUES (?, ?, ?, ?, NULL, 'invited')`,
      [
        companyId,
        roleId,
        name.trim(),
        normalizedEmail
      ]
    );

    console.log("User created:", result.insertId);

    // Audit log
    await auditLog({
      companyId,
      userId: req.user.id,
      action: "create",
      entityType: "user",
      entityId: result.insertId,
      details: `User invited: ${normalizedEmail}`,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: "User invited successfully",
      user: {
        id: result.insertId,
        company_id: companyId,
        role_id: roleId,
        name: name.trim(),
        email: normalizedEmail,
        role: roles[0].name,
        status: "invited",
        lastLogin: null
      }
    });

  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    console.error("MySQL error:", error.code);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered"
      });
    }

    next(error);
  }
};


// ========================================
// GET AVAILABLE ROLES
// ========================================
exports.listRoles = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, permissions
       FROM roles
       WHERE company_id = ?
       ORDER BY id ASC`,
      [req.user.company_id]
    );

    res.json(rows);

  } catch (error) {
    console.error("LIST ROLES ERROR:", error);
    next(error);
  }
};
