import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Department from "../models/Department.js";

/**
 * =========================
 * GET ALL USERS (EMPLOYEES)
 * =========================
 * @route   GET /api/users
 * @access  Private (admin / manager)
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "superadmin" } })
      .select("-password")
      .populate({ path: "department", options: { lean: true } });

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * GET LOGGED-IN USER PROFILE
 * =========================
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

/**
 * =========================
 * GET USER BY ID
 * =========================
 * @route   GET /api/users/:id
 * @access  Private (admin / manager)
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("department");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * CREATE EMPLOYEE
 * =========================
 * @route   POST /api/users
 * @access  Private (admin)
 */
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      role: role || "employee",
    });

    res.status(201).json({
      message: "Employee created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Create employee error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * UPDATE EMPLOYEE (EDIT)
 * =========================
 * @route   PUT /api/users/:id
 * @access  Private (admin / manager)
 */
export const updateUser = async (req, res) => {
  try {
    const { name, email, department, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.department = department ?? user.department;

    await user.save();

    res.json({
      message: "Employee updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * UPDATE USER ROLE
 * =========================
 * @route   PUT /api/users/:userId/role
 * @access  Private (superadmin)
 */
export const updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { userId } = req.params;
    const { role } = req.body;

    if (!["employee", "manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(400).json({ message: "Cannot change superadmin role" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated", role });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * DELETE / DEACTIVATE USER
 * =========================
 * @route   DELETE /api/users/:id
 * @access  Private (admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
