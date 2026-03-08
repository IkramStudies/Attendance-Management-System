import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import api from "../services/api";
import CreatePassword from "./CreatePassword";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const hasVerified = useRef(false);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      console.log("Frontend: Starting verification for token:", token);
      try {
        // 1. Log the status check
        console.log("Frontend: Fetching verify-status...");
        const statusResponse = await api.get(`/auth/verify-status/${token}`);
        console.log("Status Response Data:", statusResponse.data);

        if (statusResponse.data.needsPasswordSet) {
          console.log(
            "User needs to set password. Redirecting to CreatePassword.",
          );
          setNeedsPassword(true);
          setStatus("needsPassword");
          return;
        }

        // 2. Log the actual verification call
        console.log("Frontend: Proceeding to verify-email POST...");
        // Passing an empty object {} as the body
        const verifyResponse = await api.post(
          `/auth/verify-email/${token}`,
          {},
        );
        console.log("Verify Response Data:", verifyResponse.data);

        const { success, alreadyVerified, message } = verifyResponse.data;

        if (success || alreadyVerified) {
          setTimeout(() => {
            setStatus("success");
            setMessage(message || "Email verified successfully!");
          }, 2000); // 3000ms = 3 seconds
        } else {
          setStatus("error");
          setMessage(message || "Verification failed");
        }
      } catch (error) {
        console.error(
          "Frontend catch block caught error:",
          error.response || error,
        );
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Invalid or expired verification link.",
        );
      }
    };

    if (!token) {
      console.warn("No token found in URL");
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    if (hasVerified.current) {
      console.log("Preventing double-execution via useRef");
      return;
    }

    hasVerified.current = true;
    checkVerificationStatus();
  }, [token]);

  // If user needs to set password, show CreatePassword component
  if (needsPassword) {
    return <CreatePassword token={token} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Main card */}
        <div className="shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-500 hover:shadow-gray-500/20">
          {/* Header */}
          <div className="relative bg-gray-900 px-8 py-12 text-center overflow-hidden border-b-4 border-gray-700">
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Floating animation icon */}
            <div className="relative w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl transform transition-transform duration-300 hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full opacity-20 animate-ping"></div>
              <Mail
                className="text-gray-900 relative z-10"
                size={48}
                strokeWidth={1.5}
              />
            </div>

            <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Email Verification
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              Confirming your email address
            </p>
          </div>

          {/* Content area */}
          <div className="bg-white px-8 py-12">
            {status === "loading" && (
              <div className="text-center space-y-6 animate-fade-in">
                <div className="relative">
                  <Loader2
                    className="w-20 h-20 text-gray-600 animate-spin mx-auto"
                    strokeWidth={2}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-900 text-xl font-bold">
                    Verifying your email...
                  </p>
                  <p className="text-gray-600 text-sm max-w-xs mx-auto">
                    Please wait a moment while we confirm your email address
                  </p>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="text-center space-y-6 animate-fade-in">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center transform transition-all duration-500 hover:scale-110">
                    <CheckCircle
                      className="text-green-600"
                      size={56}
                      strokeWidth={2}
                    />
                  </div>
                  <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping"></div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Verification Successful!
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">
                    {message}
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    to="/login"
                    className="group inline-flex items-center justify-center gap-3 w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 border-2 border-gray-900"
                  >
                    <span>Continue to Login</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="text-center space-y-6 animate-fade-in">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center transform transition-all duration-500 hover:scale-110">
                    <XCircle
                      className="text-red-600"
                      size={56}
                      strokeWidth={2}
                    />
                  </div>
                  <div className="absolute inset-0 bg-red-400 rounded-full opacity-20 animate-ping"></div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Verification Failed
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">
                    {message}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 border-2 border-gray-900"
                  >
                    <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Register Again</span>
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transform transition-all duration-200 hover:scale-105"
                  >
                    <span>Back to Login</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-gray-400 text-sm font-medium">
          © 2025 Oasis Ascend. All rights reserved.
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
