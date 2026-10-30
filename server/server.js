const express = require("express");
const cors = require("cors");

const { PORT } = require("./config/env");
const app = express();

// =========================
// Middleware
// =========================

app.use(cors());
app.use(express.json());




// =========================
// Basic Routes
// =========================

app.get("/", (req, res) => {
  res.send("Hello World");
});


// =========================
// Start Server
// =========================

async function startServer() {
  try {


    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();