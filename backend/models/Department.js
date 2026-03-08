import mongoose from "mongoose";

/**
 * Level Schema
 * Example:
 * Level 1 → Web Developer I → Salary
 */
const levelSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
      min: 1,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

/**
 * Designation Schema
 * Example:
 * Web Developer → Level I, II, III
 */
const designationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    levels: {
      type: [levelSchema],
      required: true,
      validate: {
        validator: (levels) => levels.length > 0,
        message: "At least one level is required",
      },
    },
  },
  { _id: true }
);

/**
 * Department Schema
 */
const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    designations: {
      type: [designationSchema],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // superadmin / manager
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);
