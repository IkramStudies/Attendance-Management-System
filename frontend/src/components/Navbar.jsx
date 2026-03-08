import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import logo from "../assets/Oasis-test-logo-3.webp";
import { LogOut, Clock, Menu, ShieldCheck, X } from "lucide-react";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* MONOCHROME THEME: Deep Black/Gray with clean white border */}
      <nav className="w-full bg-[#1E2939] text-white shadow-xl sticky top-0 z-50 border-b border-white/5">
        <div className="w-full px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Menu Toggle & Brand */}
            <div className="flex items-center gap-3">
              {user && (
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all active:scale-95 border border-white/5"
                  aria-label="Open menu"
                >
                  <Menu size={20} className="text-neutral-300" />
                </button>
              )}

              <div className="flex items-center gap-3">
                <div className="relative group">
                  {/* Clean, simple border box for logo */}
                  <div className="relative rounded-lg p-1 bg-white/5 border border-white/10 group-hover:border-white/30 transition-colors">
                    <img
                      src={logo}
                      alt="Oasis Logo"
                      className="h-7 sm:h-8 w-auto object-contain brightness-0 invert" // Forces logo to white if needed
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            {user && (
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Real-time Clock - Neutral Styling */}
                <div className="hidden md:flex items-center gap-2 bg-[#1E2939] rounded-lg px-4 py-1.5 border border-white/5">
                  <Clock size={14} className="text-neutral-400" />
                  <span className="text-xs font-bold font-mono text-neutral-200">
                    {currentTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
                {/* Role Badge - Gray & White contrast */}
                {/* Only show this div if user.role === 'superadmin' */}
                {user.role === "superadmin" && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2939] rounded-lg border border-white/10">
                    <ShieldCheck size={13} className="text-neutral-300" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-100">
                      Super Admin
                    </span>
                  </div>
                )}

                {/* Show role label for all other users */}
                {user.role !== "superadmin" && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2939] rounded-lg border border-white/10">
                    <ShieldCheck size={13} className="text-neutral-300" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-100">
                      {user.role}
                    </span>
                  </div>
                )}

                {/* Logout Button - Clean Monochrome */}
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 shadow-lg group"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-[280px] h-full animate-in slide-in-from-left duration-300">
            <Sidebar
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
            />
            {/* Improved Close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 -right-12 p-2 bg-neutral-900 text-white rounded-full border border-white/10"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
