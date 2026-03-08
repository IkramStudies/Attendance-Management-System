import { Schema, model } from "mongoose";

const attendanceSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String, // removed enum to allow custom statuses
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Attendance = model("Attendance", attendanceSchema);

export default Attendance;
