import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // Simulated API call - replace with your actual API
      // const res = await api.post(`/auth/reset-password/${token}`, { password });

      // Simulated success for demo
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess("Password reset successful! Redirecting to login...");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Reset link is invalid or expired"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return { strength: 0, label: "", color: "" };
    if (pwd.length < 6)
      return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (pwd.length < 10)
      return { strength: 2, label: "Medium", color: "bg-yellow-500" };
    return { strength: 3, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Reset Password
            </h2>
            <p className="text-blue-100 text-sm">
              Create a strong new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle
                  className="text-red-500 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle
                  className="text-green-500 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength.strength >= 1
                          ? passwordStrength.color
                          : "bg-gray-200"
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength.strength >= 2
                          ? passwordStrength.color
                          : "bg-gray-200"
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength.strength >= 3
                          ? passwordStrength.color
                          : "bg-gray-200"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Password strength:{" "}
                    <span className="font-semibold">
                      {passwordStrength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle size={16} className="text-green-500" />
                      <p className="text-xs text-green-600 font-medium">
                        Passwords match
                      </p>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-red-500" />
                      <p className="text-xs text-red-600 font-medium">
                        Passwords do not match
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-800">
                <strong>Password requirements:</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                <li>At least 6 characters long</li>
                <li>Mix of letters and numbers recommended</li>
                <li>Avoid common passwords</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Reset Password
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Login
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 text-white text-sm opacity-90">
          © 2025 Attendance System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
