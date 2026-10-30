  const mysql = require("mysql2/promise");

  
  
  const pool = mysql.createPool({
  host: "127.0.0.1",
  port: "3307",
  user: "root",
  password: "root",
  database: "'operadashboard'",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL Connected Successfully!");

    connection.release();
  } catch (err) {
    console.log("Database connection failed");
    console.log(err);
  }
}

testConnection();