// routes/departmentRoutes.js
import express from "express";
import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import { protect } from "../middlewares/authMiddleware.js"; // optional, if you protect routes

const router = express.Router();

// Create a department
router.post("/", protect, createDepartment);

// Get all departments
router.get("/", protect, getDepartments);

// Update a department
router.put("/:id", protect, updateDepartment);

// Delete a department
router.delete("/:id", protect, deleteDepartment);

export default router;
