const express = require("express");
const authController = require("../controllers/auth.controller");
const { authLimiter } = require("../middleware/rateLimiter.middleware");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validators.middleware");

const router = express.Router();

// Apply stricter rate limiter to all auth routes
router.use(authLimiter);

/* POST /api/auth/register */
router.post(
  "/register",
  validateRegister,
  authController.userRegisterController,
);

/* POST /api/auth/login */
router.post("/login", validateLogin, authController.userLoginController);

/**
 * - POST /api/auth/logout
 */
router.post("/logout", authController.userLogoutController);

module.exports = router;
