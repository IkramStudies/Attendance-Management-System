import { z } from "zod";

export const attendanceItemSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  status: z.enum(["present", "absent"]),
  date: z.string().optional(), // ISO date string
});

export const attendanceArraySchema = z.array(attendanceItemSchema).min(1);
