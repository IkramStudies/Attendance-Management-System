import express from "express";
import {
  getUsers,
  getUserProfile,
  getUserById,
  createEmployee,
  updateUser,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * =========================
 * USER ROUTES
 * =========================
 */

// Get all users (superadmin / manager)
router.get("/", protect, authorize("superadmin", "manager"), getUsers);

// Get logged-in user profile (any authenticated user)
router.get("/profile", protect, getUserProfile);

// Get user by ID (superadmin / manager)
router.get("/:id", protect, authorize("superadmin", "manager"), getUserById);

// Create employee (superadmin / manager)
router.post("/", protect, authorize("superadmin", "manager"), createEmployee);

// Update employee (superadmin / manager)
router.put("/:id", protect, authorize("superadmin", "manager"), updateUser);

// Update user role (superadmin only)
router.put("/:userId/role", protect, authorize("superadmin"), updateUserRole);

// Delete / deactivate employee (superadmin / manager)
router.delete("/:id", protect, authorize("superadmin", "manager"), deleteUser);

export default router;
