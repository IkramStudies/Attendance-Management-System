import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Your 16-character App Password: xhecpqdbiutmylgr
  },
  tls: {
    // This helps bypass some local network security restrictions
    rejectUnauthorized: false,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  // Added a try/catch here to ensure errors are caught during the mail send process
  try {
    const info = await transporter.sendMail({
      from: `"Attendance System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (error) {
    // Re-throwing the error so your controller's catch block can handle the cleanup
    console.error("❌ Nodemailer Error:", error.message);
    throw error;
  }
};

export default sendEmail;
