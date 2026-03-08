import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({
      email: "ikramwani51@gmail.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Admin",
      email: "admin123@gmail.com",
      password: hashedPassword,
      role: "admin",
      designation: "Manager",
      isEmailVerified: true,
    });

    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
