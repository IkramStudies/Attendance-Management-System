import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import useAuth from "../hooks/useAuth";
import {
  Mail,
  Lock,
  LogIn,
  UserCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const roleRedirectMap = {
  admin: "/employee-dashboard",
  teacher: "/employee-dashboard",
  employee: "/employee-dashboard",
  intern: "/employee-dashboard",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      login(data);
      navigate(roleRedirectMap[data.role] || "/employee-dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";

      if (errorMsg.includes("verify your email")) {
        setError(
          "⚠️ Email Not Verified: Please check your inbox and click the verification link before logging in."
        );
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative w-full max-w-md">
        <div className="shadow-2xl " style={{ borderRadius: "8px" }}>
          <div
            className="bg-gray-900 px-8 py-10 text-center border-b-4 border-gray-700"
            style={{ borderRadius: "8px" }}
          >
            <div className="w-20 h-20 bg-white mx-auto mb-4 flex items-center justify-center rounded-sm">
              <LogIn className="text-gray-900" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">
              Sign in to access your account
            </p>
          </div>

          <form onSubmit={submit} className="px-8 py-8 space-y-5 bg-white">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 p-4 flex items-start gap-3">
                <AlertCircle
                  className="text-red-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 transition-all"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 transition-all"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-2 border-gray-400 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-gray-900 hover:text-gray-700 font-semibold underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none border-2 border-gray-900"
              style={{ borderRadius: "10px" }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Login</span>
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t-2 border-gray-200">
              <p className="text-gray-700 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-gray-900 hover:text-gray-700 font-bold underline transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 text-gray-400 text-sm">
          © 2025 Attendance System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
