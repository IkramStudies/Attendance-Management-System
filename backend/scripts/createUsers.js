import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

// 👇 Name → Designation mapping
const users = [
  { name: "Raqeeb", designation: "Project and Sales Manager" },
  { name: "Musaib", designation: "Sales Manager" },
  { name: "Sartaj", designation: "Web Developer" },
  { name: "Shahid", designation: "Web Developer" },
  { name: "Aakib", designation: "Web Developer" },
  { name: "Zehraan", designation: "Digital Marketing Executive" },
  { name: "Mubashir", designation: "Video Editor" },
  { name: "Afnan", designation: "Accountant" },
  { name: "Saqib", designation: "Sales Executive" },
  { name: "Zamin", designation: "Business Development Executive" },
  { name: "Azhar", designation: "Cinematographer" },
  { name: "Sadie", designation: "Social Media Manager" },
  { name: "Umaid", designation: "Web Developer" },
  { name: "Aasif", designation: "Web Developer" },
  { name: "Mehran", designation: "Web Developer" },
  { name: "Haziq", designation: "Shopify and Wordpress Developer" },
];

const createUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const userDocs = users.map((user) => ({
      name: user.name,
      email: `${user.name.toLowerCase()}@gmail.com`,
      password: hashedPassword,
      role: "employee",
      designation: user.designation,
      isEmailVerified: true,
    }));

    // 🧹 Remove existing users with same emails
    await User.deleteMany({
      email: { $in: userDocs.map((u) => u.email) },
    });

    await User.insertMany(userDocs);

    console.log("✅ Employees created successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating users:", error);
    process.exit(1);
  }
};

createUsers();
