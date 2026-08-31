const express = require("express");
const auth = require("../controller/authController");
const router = express.Router();

/* POST /api/auth/register */
router.post("/register", auth.registerUser);
router.post("/login", auth.loginUser);
router.post("/logout", auth.logoutUser);
/* POST /api/auth/login */
module.exports = router;