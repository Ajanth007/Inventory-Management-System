
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const [rows] = await db.query(
      `SELECT
        u.id,
        u.company_id,
        u.role_id,
        u.name,
        u.email,
        u.password_hash,
        u.status,
        r.name AS role_name,
        r.permissions
       FROM users u
       INNER JOIN roles r ON r.id = u.role_id
       WHERE u.email = ?
       LIMIT 1`,
      [email.trim()]
    );

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = rows[0];

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash || ""
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        company_id: user.company_id,
        role_id: user.role_id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
      }
    );

    await db.query(
      "UPDATE users SET last_login_at = NOW() WHERE id = ?",
      [user.id]
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        company_id: user.company_id,
        role_id: user.role_id,
        name: user.name,
        email: user.email,
        role: user.role_name,
        permissions: typeof user.permissions === "string"
          ? JSON.parse(user.permissions)
          : user.permissions
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT
        u.id,
        u.company_id,
        u.role_id,
        u.name,
        u.email,
        u.status,
        r.name AS role_name,
        r.permissions
       FROM users u
       INNER JOIN roles r ON r.id = u.role_id
       WHERE u.id = ?
         AND u.company_id = ?
       LIMIT 1`,
      [req.user.id, req.user.company_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = rows[0];

    res.json({
      success: true,
      user: {
        ...user,
        permissions: typeof user.permissions === "string"
          ? JSON.parse(user.permissions)
          : user.permissions
      }
    });

  } catch (error) {
    next(error);
  }
};
