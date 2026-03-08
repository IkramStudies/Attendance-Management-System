import api from "./api";
import axios from "axios"; // if needed

// ==========================
// GET
// ==========================

// Fetch all attendance records (admin / manager)
export const getAttendance = async () => {
  const { data } = await api.get("/attendance");
  return data;
};

// Check attendance for a specific date
export const getAttendanceByDate = async (date) => {
  const { data } = await api.get(`/attendance/check/${date}`);
  return data;
};

// ==========================
// POST
// ==========================

// Mark attendance (bulk create)
export const markAttendance = async (payload) => {
  const { data } = await api.post("/attendance", payload);
  return data;
};

// ==========================
// PUT
// ==========================

// Update single attendance record (ADMIN)
export const updateAttendance = async (id, status) => {
  const { data } = await api.put(`/attendance/${id}`, { status });
  return data;
};

// ==========================
// CONTROLLERS
// ==========================

// Controller: prepare attendance payload for submission
export const prepareAttendancePayload = (employees, date) => {
  return employees.map((e) => ({
    employee: e._id, // ✅ change this
    status: e.status,
    date,
  }));
};

// Controller: toggle employee attendance status locally
export const toggleEmployeeStatus = (employees, employeeId, newStatus) => {
  return employees.map((e) =>
    e._id === employeeId ? { ...e, status: newStatus } : e,
  );
};

// Controller: check if attendance has been taken for a given date
export const isAttendanceTaken = (attendanceRecords) => {
  return attendanceRecords && attendanceRecords.length > 0;
};

// Fetch attendance statuses
export const getAttendanceStatuses = async () => {
  const { data } = await api.get("/attendance/status");
  return data;
};
