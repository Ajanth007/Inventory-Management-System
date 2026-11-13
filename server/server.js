/* const express = require("express");
const cors = require("cors");

const { PORT } = require("./config/env");
const { pool } = require("./db"); // Import MySQL pool

// const app = express();
app.use(express.json());

const resourceRoutes = require("./routes/resourceRoutes");

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
 */


/* require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

const resourceRoutes = require("./routes/resourceRoutes");

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Opera Management API is running"
  });
});

app.use("/api/resources", resourceRoutes);

// Other module routes will be mounted here.
app.use(require("./middleware/errorMiddleware"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Opera API running on port ${PORT}`);
}); */



require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {pool} = require("./config/db");


const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ],
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

// Root test
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Opera Management API is running"
  });
});

// Database health check
app.get("/api/health", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      success: true,
      database: "connected"
    });
  } catch (error) {
    next(error);
  }
});

// Authentication
// app.use("/api/auth", require("./routes/authRoutes"));

// Company
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/company", require("./routes/settingsRoutes"));

// Resources
app.use("/api", require("./routes/resourceRoutes"));

// Purchases
app.use("/api", require("./routes/purchaseRoutes"));

// Sales
app.use("/api", require("./routes/salesRoutes"));

// Invoices
app.use("/api", require("./routes/invoiceRoutes"));

// Payments
app.use("/api", require("./routes/paymentRoutes"));

// Inventory
app.use("/api/inventory", require("./routes/inventoryRoutes"));

// Accounting
app.use("/api/accounting", require("./routes/accountingRoutes"));

// Users
app.use("/api/users",require("./routes/userRoutes"));

// Audit-Logs
app.use("/api/audit-logs", require("./routes/auditLogRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use(require("./middleware/errorMiddleware"));



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("--------------------------------");
  console.log("OPERA MANAGEMENT BACKEND");
  console.log("--------------------------------");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("--------------------------------");
});
