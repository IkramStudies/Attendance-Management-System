import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import AttendanceStatus from "../models/AttendanceStatus.js";

/* =========================
   ADMIN / MANAGER
========================= */

// Mark attendance (create or update)
export const markAttendance = async (req, res) => {
  try {
    console.log("========== MARK ATTENDANCE ==========");
    console.log("Incoming payload:", req.body);

    const attendance = req.body;
    const records = [];

    for (const a of attendance) {
      console.log("Processing record:", a);

      // support both employeeId and employee
      const employeeId = a.employeeId || a.employee;

      if (!employeeId) {
        console.log("❌ Missing employee ID:", a);
        return res.status(400).json({ message: "Employee ID missing" });
      }

      const date = new Date(a.date);

      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      console.log("Checking attendance for:", employeeId, start);

      let record = await Attendance.findOne({
        employee: employeeId,
        date: { $gte: start, $lte: end },
      });

      if (record) {
        console.log("Updating existing record");

        record.status = a.status;
        await record.save();
      } else {
        console.log("Creating new record");

        record = await Attendance.create({
          employee: employeeId,
          status: a.status,
          date: start,
        });
      }

      records.push(record);
    }

    const populated = await Attendance.find({
      _id: { $in: records.map((r) => r._id) },
    }).populate("employee", "name email role designation");

    console.log("✅ Attendance saved:", populated.length);

    res.status(201).json(populated);
  } catch (error) {
    console.error("❌ Attendance Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update single attendance record
export const updateAttendance = async (req, res) => {
  try {
    const { status } = req.body;

    const record = await Attendance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    record.status = status;
    await record.save();

    const populated = await record.populate(
      "employee",
      "name email role designation",
    );

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance records (Admin view)
export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("employee", "name email role designation")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance by employee (Admin view)
export const getAttendanceByEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const records = await Attendance.find({ employee: id })
      .populate("employee", "name email role designation")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

// ✅ FIXED: Get attendance by date (includes managers)
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const employees = await User.find({
      role: { $ne: "superadmin" },
    }).select("name email role designation");

    const records = await Attendance.find({
      date: { $gte: start, $lte: end },
    }).populate("employee", "name email role designation");

    res.json({
      taken: records.length > 0,
      employees,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

/* =========================
   EMPLOYEE (SELF)
========================= */

// Get own attendance
export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({
      employee: req.user._id,
    })
      .populate("employee", "name email role designation")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

// ✅ FIXED: Get own attendance by date
export const getMyAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const record = await Attendance.findOne({
      employee: req.user._id,
      date: { $gte: start, $lte: end },
    }).populate("employee", "name email role designation");

    res.json(record ? [record] : []);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

/* =========================
   ATTENDANCE STATUSES
========================= */

export const getStatuses = async (req, res) => {
  try {
    const statuses = await AttendanceStatus.find().sort({ name: 1 });
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStatus = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await AttendanceStatus.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Status already exists" });
    }

    const status = await AttendanceStatus.create({ name });
    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { name } = req.body;

    const status = await AttendanceStatus.findById(req.params.id);
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    status.name = name;
    await status.save();

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStatus = async (req, res) => {
  try {
    const status = await AttendanceStatus.findById(req.params.id);
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    await status.deleteOne();
    res.json({ message: "Status deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
