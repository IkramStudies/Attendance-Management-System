import express from "express";
import {
  markAttendance,
  updateAttendance,
  getAllAttendance,
  getAttendanceByDate,
  getAttendanceByEmployee,
  getMyAttendance,
  getMyAttendanceByDate,
  getStatuses,
  addStatus,
  deleteStatus,
  updateStatus,
} from "../controllers/attendanceController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================
   ATTENDANCE (ADMIN / OWNER)
========================= */

// Mark attendance
router.post("/", protect, authorize("superadmin", "manager"), markAttendance);

// Update attendance
router.put(
  "/:id",
  protect,
  authorize("superadmin", "manager"),
  updateAttendance,
);

// Get all attendance
router.get("/", protect, authorize("superadmin", "manager"), getAllAttendance);

// Get attendance by date
router.get(
  "/check/:date",
  protect,
  authorize("superadmin", "manager"),
  getAttendanceByDate,
);

// Get ONE employee’s attendance (used by EmployeeAttendance.jsx)
router.get(
  "/employee/:id",
  protect,
  authorize("superadmin", "manager"),
  getAttendanceByEmployee,
);

/* =========================
   ATTENDANCE (EMPLOYEE)
========================= */

router.get("/me/:date", protect, authorize("employee"), getMyAttendanceByDate);

router.get("/me", protect, authorize("employee"), getMyAttendance);

/* =========================
   ATTENDANCE STATUSES
========================= */

router.get("/status", protect, getStatuses);

router.post("/status", protect, authorize("superadmin", "manager"), addStatus);

router.put(
  "/status/:id",
  protect,
  authorize("superadmin", "manager"),
  updateStatus,
);

router.delete(
  "/status/:id",
  protect,
  authorize("superadmin", "manager"),
  deleteStatus,
);

export default router;
