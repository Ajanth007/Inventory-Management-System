
const db = require("../config/db");

exports.getCompany = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        name,
        tax_id,
        country,
        email,
        phone,
        address,
        currency,
        locale
       FROM companies
       WHERE id = ?`,
      [req.user.company_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
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
