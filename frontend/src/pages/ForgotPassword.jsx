import { useState } from "react";
import {
  Mail,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Send,
  Shield,
} from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Simulated API call - replace with your actual forgotPassword function
      // await forgotPassword(email);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(
        "If an account exists with this email, a password reset link has been sent. Please check your inbox and spam folder."
      );
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 p-4">
      <div className="relative w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-300 opacity-10 rounded-full blur-2xl" />

        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Forgot Password?
              </h2>
              <p className="text-blue-100 text-sm">
                No worries! Enter your email and we'll send you reset
                instructions
              </p>
            </div>
          </div>

          <div className="px-8 py-8 space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
                <AlertCircle
                  className="text-red-500 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
                <CheckCircle
                  className="text-green-500 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            {!success && (
              <>
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                      disabled={loading}
                    />
                    {email && isValidEmail(email) && (
                      <CheckCircle
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                        size={20}
                      />
                    )}
                  </div>
                  {email && !isValidEmail(email) && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Mail
                      className="text-blue-600 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        What happens next?
                      </p>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        We'll send a secure password reset link to your email.
                        The link will expire in 15 mins for your security.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !email || !isValidEmail(email)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Reset Link
                    </>
                  )}
                </button>
              </>
            )}

            {/* Resend Option (shown after success) */}
            {success && (
              <button
                type="button"
                onClick={() => {
                  setSuccess("");
                  setError("");
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-all"
              >
                Send to a Different Email
              </button>
            )}

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Login
              </button>
            </div>

            {/* Additional Help */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Need help?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Contact Support
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-white text-sm opacity-90">
          © 2025 Attendance System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
