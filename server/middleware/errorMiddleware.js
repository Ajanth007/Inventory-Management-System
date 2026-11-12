
module.exports = (err, req, res, next) => {
  console.error("API Error:", err);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500
      ? "Internal server error"
      : err.message
  });
};
