import mongoose from "mongoose";
import dotenv from "dotenv";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

dotenv.config();

const populateAttendance = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const employees = await User.find({ role: "employee" });

    if (!employees.length) {
      console.log("No employees found");
      process.exit(0);
    }

    const today = new Date();
    const attendanceData = [];

    // Track leaves per employee per month
    // key: empId-yyyy-mm → leaveCount
    const monthlyLeaveTracker = new Map();

    for (let i = 0; i < 380; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const day = date.getDay();
      // Skip weekends (Saturday=6, Sunday=0)
      if (day === 0 || day === 6) continue;

      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      for (const emp of employees) {
        const empMonthKey = `${emp._id}-${monthKey}`;
        const usedLeaves = monthlyLeaveTracker.get(empMonthKey) || 0;

        let status;

        const rand = Math.random();

        if (rand < 0.91) {
          // ~91% present
          status = "present";
        } else if (usedLeaves < 2) {
          // Allow up to 2 leaves/month
          status = "leave";
          monthlyLeaveTracker.set(empMonthKey, usedLeaves + 1);
        } else {
          // Leaves exhausted → absent
          status = "absent";
        }

        attendanceData.push({
          employee: emp._id,
          status,
          date,
          markedBy: null,
        });
      }
    }

    await Attendance.insertMany(attendanceData);
    console.log("✅ Attendance populated with max 2 leaves/month");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error populating attendance:", error);
    process.exit(1);
  }
};

populateAttendance();
