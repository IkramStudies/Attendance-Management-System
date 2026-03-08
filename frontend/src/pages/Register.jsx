import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  Inbox,
} from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // Validate terms acceptance
    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }
    setLoading(true);
    try {
      const response = await registerUser({
        name,
        email,
        password,
      });
      // 🔐 Store email for resend verification (temporary)
      localStorage.setItem("pendingEmail", email);
      // ✅ Email verification flow
      if (
        response?.message &&
        response.message.toLowerCase().includes("verify")
      ) {
        setSuccess(true);
        setVerificationSent(true);
        return;
      }
      // ⚠️ Fallback for older backend (no email verification)
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { text: "", color: "" };
    if (password.length < 6) return { text: "Weak", color: "text-red-500" };
    if (password.length < 10)
      return { text: "Medium", color: "text-yellow-500" };
    return { text: "Strong", color: "text-green-500" };
  };
  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative w-full max-w-md">
        {/* Register Card */}
        <div className="shadow-2xl" style={{ borderRadius: "8px" }}>
          {/* Header Section - Reduced */}
          <div className="bg-gray-900 px-6 py-6 text-center border-b-4 border-gray-700 rounded-lg">
            <div className="w-16 h-16 bg-white mx-auto mb-3 flex items-center justify-center rounded-sm">
              <UserPlus className="text-gray-900" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Create Account
            </h2>
            <p className="text-gray-400 text-xs">
              Join our attendance management system
            </p>
          </div>

          {/* Success Message - Email Verification Required */}
          {success && verificationSent && (
            <div className="bg-blue-50 border-b-2 border-blue-200 px-6 py-4">
              <div className="flex items-start gap-2 mb-3">
                <Inbox className="text-blue-500 flex-shrink-0" size={20} />
                <div>
                  <p className="text-blue-900 font-bold text-sm mb-1">
                    Check Your Email!
                  </p>
                  <p className="text-blue-700 text-xs leading-relaxed">
                    We've sent a verification link to <strong>{email}</strong>
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 mb-3">
                <p className="text-gray-700 text-xs mb-2 font-medium">
                  📧 Next Steps:
                </p>
                <ol className="text-xs text-gray-600 space-y-1 ml-4 list-decimal">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the verification link in the email</li>
                  <li>Return here to login</li>
                </ol>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 text-sm rounded-lg transition-all duration-200"
                >
                  Go to Login
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setVerificationSent(false);
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setName("");
                    setAgreedToTerms(false);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 text-sm rounded-lg transition-all duration-200"
                >
                  Register Another
                </button>
              </div>
            </div>
          )}

          {/* Success Message - Old Style (No Email Verification) */}
          {success && !verificationSent && (
            <div className="bg-green-50 border-b-2 border-green-200 px-6 py-3 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <p className="text-green-800 font-semibold text-xs">
                  Registration Successful!
                </p>
                <p className="text-green-600 text-xs">
                  Redirecting to login...
                </p>
              </div>
            </div>
          )}

          {/* Form Section - Hide when success */}
          {!success && (
            <form onSubmit={submit} className="px-6 py-5 space-y-3 bg-white">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-600 p-2.5 flex items-start gap-2 animate-shake">
                  <AlertCircle
                    className="text-red-600 flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <p className="text-red-800 text-xs">{error}</p>
                </div>
              )}
              {/* Name Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 transition-all"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 transition-all"
                    disabled={loading}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  We'll send a verification link to this email
                </p>
              </div>
              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-sm border-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 transition-all"
                    disabled={loading}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          password.length < 6
                            ? "bg-red-500 w-1/3"
                            : password.length < 10
                            ? "bg-yellow-500 w-2/3"
                            : "bg-green-500 w-full"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${passwordStrength.color}`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
              </div>
              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-sm border-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 transition-all"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {/* Match Indicator */}
                {confirmPassword.length > 0 && (
                  <div className="mt-1 flex items-center gap-1">
                    {confirmPassword === password ? (
                      <>
                        <CheckCircle size={12} className="text-green-600" />
                        <p className="text-xs text-green-600">
                          Passwords match
                        </p>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={12} className="text-red-500" />
                        <p className="text-xs text-red-500">
                          Passwords do not match
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
              {/* Terms & Conditions */}
              <div className="flex items-start gap-1.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-3.5 h-3.5 mt-0.5 border-2 border-gray-400 focus:ring-0 focus:ring-offset-0"
                  required
                />
                <label htmlFor="terms" className="text-xs text-gray-700">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-gray-900 hover:text-gray-700 font-semibold underline"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-gray-900 hover:text-gray-700 font-semibold underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {/* Register Button */}
              <button
                type="submit"
                disabled={
                  loading || password !== confirmPassword || !agreedToTerms
                }
                className="w-full bg-[#1E2939] hover:bg-[#1E2939]-800 disabled:bg-gray-400 text-white font-semibold py-2 text-sm transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none rounded-sm"
                style={{ background: "#1E2939" }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
              {/* Login Link */}
              <div className="text-center pt-2.5 border-t-2 border-gray-200">
                <p className="text-gray-700 text-xs">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-gray-900 hover:text-gray-700 font-bold underline transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer Text */}
        <p className="text-center mt-4 text-gray-400 text-xs">
          © 2025 Oasis Ascend. All rights reserved.
        </p>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Register;
