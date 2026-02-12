const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const { generalLimiter } = require("./middleware/rateLimiter.middleware");
const globalErrorHandler = require("./middleware/errorHandler.middleware");

const app = express();

/**
 * ─────────────────────────────────────────────
 *  SECURITY MIDDLEWARE
 * ─────────────────────────────────────────────
 */

// 1. Helmet — sets secure HTTP headers (XSS, HSTS, CSP, etc.)
app.use(helmet());

// 2. CORS — restrict which origins can talk to this API
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 3. Rate Limiter — apply general rate limiting to all routes
app.use(generalLimiter);

// 4. Body Parser — limit payload size to 10kb to prevent large-body attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 5. Cookie Parser
app.use(cookieParser());

// 6. Mongo Sanitize — prevent NoSQL injection ($gt, $regex, etc.)
app.use(mongoSanitize());

/**
 * ─────────────────────────────────────────────
 *  ROUTES
 * ─────────────────────────────────────────────
 */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.routes");

// Health Check
app.get("/", (req, res) => {
  res.send("Ledger Service is up and running");
});

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRoutes);

/**
 * ─────────────────────────────────────────────
 *  404 HANDLER — Catch unmatched routes
 * ─────────────────────────────────────────────
 */
app.all("/{*splat}", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

/**
 * ─────────────────────────────────────────────
 *  GLOBAL ERROR HANDLER
 * ─────────────────────────────────────────────
 */
app.use(globalErrorHandler);

module.exports = app;
