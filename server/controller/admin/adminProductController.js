const { pool } = require("../../db");

const getAllProducts = async (req, res) => {
  try {
    const response = await pool.query(`SELECT * FROM products;`);

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error in fetching getAllProducts :", error);
  }
};

module.exports = {
  getAllProducts,
};
