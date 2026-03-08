import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  verifyStatus,
  // Add this
} from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email/:token", verifyEmail);
router.get("/verify-status/:token", verifyStatus);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
