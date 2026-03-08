import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

/* =====================================================
   REGISTER USER + SEND VERIFICATION EMAIL
===================================================== */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Sanitize input
    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 3. Determine Role (First user is Super Admin)
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "superadmin" : "employee";

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 4. Create the user in the database
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // 5. Attempt to send the email
    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "Verify your email - Attendance System",
        html: `
          <div style="font-family: sans-serif; line-height: 1.5;">
            <h2>Welcome, ${name}!</h2>
            <p>Please click the link below to verify your email address and activate your account:</p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
            <p>${verifyUrl}</p>
            <p style="color: #666; font-size: 0.8em;">This link expires in 24 hours.</p>
          </div>
        `,
      });

      // 6. Success Response
      return res.status(201).json({
        message:
          role === "superadmin"
            ? "Super admin account created. Please verify your email."
            : "Registration successful. Please check your email to verify.",
      });
    } catch (emailError) {
      // 7. Cleanup: If email fails, delete the user so they aren't "locked out"
      await User.findByIdAndDelete(newUser._id);

      console.error("❌ Registration email failed:", emailError.message);

      return res.status(500).json({
        message:
          "Could not send verification email. Please check your internet connection or try a different email address.",
      });
    }
  } catch (error) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =====================================================
   VERIFY EMAIL
===================================================== */
export const verifyEmail = async (req, res) => {
  console.log("--- Verify Email Started ---");
  console.log("Token from params:", req.params.token);
  console.log("Body contents (password check):", req.body);

  try {
    const { token } = req.params;
    // This prevents the "cannot destructure of undefined" error
    const { password } = req.body || {};

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    console.log("User found in DB:", user ? user.email : "NO USER FOUND");

    if (!user) {
      console.log("Verification failed: Token invalid or expired");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link.",
      });
    }

    if (password) {
      console.log("Password detected, hashing...");
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    user.isEmailVerified = true;
    user.verifiedAt = new Date();
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();
    console.log("User saved successfully. Verification complete.");

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    // THIS IS THE MOST IMPORTANT LOG
    console.error("DETAILED SERVER ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
/* =====================================================
   LOGIN USER
===================================================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   RESEND VERIFICATION EMAIL
===================================================== */
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    // Reset resend count after 24h
    if (
      user.lastVerificationResend &&
      Date.now() - user.lastVerificationResend.getTime() > 24 * 60 * 60 * 1000
    ) {
      user.resendVerificationCount = 0;
    }

    if (user.resendVerificationCount >= 3) {
      return res.status(429).json({
        message: "Too many verification attempts. Please contact support.",
        blocked: true,
      });
    }

    const newToken = crypto.randomBytes(32).toString("hex");

    user.emailVerificationToken = newToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    user.resendVerificationCount += 1;
    user.lastVerificationResend = new Date();

    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${newToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your email (Resent)",
        html: `
          <h2>Email Verification</h2>
          <p>Click the link below to verify your email:</p>
          <a href="${verifyUrl}">${verifyUrl}</a>
          <p>This link expires in 24 hours.</p>
        `,
      });
    } catch (emailError) {
      console.error("Resend email failed:", emailError.message);
    }

    return res.status(200).json({
      message: "Verification email sent again",
      attemptsLeft: 3 - user.resendVerificationCount,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* =====================================================
   FORGOT PASSWORD
===================================================== */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Security: don't reveal user existence
  if (!user) {
    return res.status(200).json({
      message: "If an account exists, a reset link has been sent",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html: `
      <p>You requested a password reset.</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  res.json({ message: "Password reset link sent" });
};

/* =====================================================
   RESET PASSWORD
===================================================== */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired reset token",
    });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};

export const verifyStatus = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    res.json({
      needsPasswordSet: !user.password,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
