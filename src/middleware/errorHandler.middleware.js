/**
 * Global Error Handler Middleware
 * - Catches all unhandled errors
 * - Prevents leaking stack traces in production
 * - Returns standardized error responses
 */
function globalErrorHandler(err, req, res, next) {
  console.error("Unhandled Error:", err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({
      status: "error",
      message: "Validation failed",
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      status: "error",
      message: `Duplicate value for '${field}'. This value already exists.`,
    });
  }

  // Mongoose bad ObjectId / CastError
  if (err.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: `Invalid value for '${err.path}': ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Token has expired",
    });
  }

  // Default server error — never leak stack trace in production
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
}

module.exports = globalErrorHandler;
