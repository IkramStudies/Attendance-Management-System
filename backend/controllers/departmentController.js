// controllers/departmentController.js
import Department from "../models/Department.js";

/**
 * Create a new department
 */
export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const createdBy = req.user._id; // assume logged-in admin

    // Check if department already exists
    const exists = await Department.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "Department already exists" });

    const department = await Department.create({ name, createdBy });
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all departments
 */
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 }); // sort alphabetically
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update a department
 */
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const department = await Department.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!department)
      return res.status(404).json({ message: "Department not found" });
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Delete a department
 */
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndDelete(id);
    if (!department)
      return res.status(404).json({ message: "Department not found" });

    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
