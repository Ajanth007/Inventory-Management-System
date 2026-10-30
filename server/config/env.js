require("dotenv").config();

const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

module.exports = {
  PORT,
  JWT_SECRET,
};