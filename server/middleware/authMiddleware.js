/* 
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
      company_id: decoded.company_id,
      role_id: decoded.role_id
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;
 */

module.exports = (req, res, next) => {
  // Development only: no login required.
  // Use a fixed company and user for local testing.
  req.user = {
    id: 1,
    company_id: 1,
    role_id: 1
  };

  next();
};
