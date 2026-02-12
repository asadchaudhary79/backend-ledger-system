const { body, param, validationResult } = require("express-validator");

/**
 * Middleware to check validation results
 * Returns 422 with detailed error messages if validation fails
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
}

/**
 * Registration input validation
 */
const validateRegister = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain at least one letter"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),
  handleValidationErrors,
];

/**
 * Login input validation
 */
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

/**
 * Transaction input validation
 */
const validateTransaction = [
  body("fromAccount")
    .notEmpty()
    .withMessage("fromAccount is required")
    .isMongoId()
    .withMessage("fromAccount must be a valid ID"),
  body("toAccount")
    .notEmpty()
    .withMessage("toAccount is required")
    .isMongoId()
    .withMessage("toAccount must be a valid ID"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
  body("idempotencyKey")
    .trim()
    .notEmpty()
    .withMessage("idempotencyKey is required")
    .isLength({ max: 100 })
    .withMessage("idempotencyKey must not exceed 100 characters"),
  handleValidationErrors,
];

/**
 * Initial Funds transaction validation
 */
const validateInitialFunds = [
  body("toAccount")
    .notEmpty()
    .withMessage("toAccount is required")
    .isMongoId()
    .withMessage("toAccount must be a valid ID"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
  body("idempotencyKey")
    .trim()
    .notEmpty()
    .withMessage("idempotencyKey is required")
    .isLength({ max: 100 })
    .withMessage("idempotencyKey must not exceed 100 characters"),
  handleValidationErrors,
];

/**
 * Account ID param validation
 */
const validateAccountIdParam = [
  param("accountId").isMongoId().withMessage("Account ID must be a valid ID"),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateTransaction,
  validateInitialFunds,
  validateAccountIdParam,
};
