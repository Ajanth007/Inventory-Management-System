const express = require("express");
const cors = require("cors");

const { PORT } = require("./config/env");
const { pool } = require("./db"); // Import MySQL pool

const app = express();

const AdminRoutes =require("./routes/admin.routes")

// =========================
// Middleware
// =========================

app.use(cors());
app.use(express.json());

// =========================
// Routes
// =========================

app.use("/admin",AdminRoutes)

app.get("/", (req, res) => {
  res.send("Hello World");
});

// =========================
// Start Server
// =========================

async function startServer() {
  try {
    // Test database connection
    const connection = await pool.getConnection();

    console.log("MySQL Connected Successfully!");

    connection.release();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
}

startServer();
