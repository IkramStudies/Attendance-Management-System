import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 🔑 System roles
    role: {
      type: String,
      enum: ["superadmin", "manager", "employee"],
      default: "employee",
    },

    // 🏢 Department reference
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    // 🔐 Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    // 🔁 Password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.emailVerificationToken;
        return ret;
      },
    },
  }
);

export default mongoose.model("User", userSchema);
