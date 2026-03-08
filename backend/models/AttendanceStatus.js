import { Schema, model } from "mongoose";

const attendanceStatusSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default model("AttendanceStatus", attendanceStatusSchema);
