const rateLimit = require("express-rate-limit");

/**
 * General API rate limiter
 * - 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

/**
 * Auth rate limiter (stricter)
 * - 10 requests per 15 minutes per IP for login/register
 * - Prevents brute-force & credential stuffing attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Too many authentication attempts, please try again after 15 minutes",
  },
});

/**
 * Transaction rate limiter
 * - 30 requests per 15 minutes per IP
 * - Prevents rapid-fire transaction abuse
 */
const transactionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many transaction requests, please try again after 15 minutes",
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  transactionLimiter,
};
