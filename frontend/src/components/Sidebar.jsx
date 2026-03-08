import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  Users,
  FileText,
  Shield,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const Sidebar = ({ isMobile = false, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      path: "/employee-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["superadmin", "manager", "employee"],
    },
    {
      path: "/attendance",
      label: "Attendance",
      icon: ClipboardList,
      roles: ["superadmin", "manager"],
    },
    {
      path: "/add-status",
      label: "Attendance Status",
      icon: Settings,
      roles: ["superadmin"],
    },
    {
      path: "/employees",
      label: "Employees",
      icon: Users,
      roles: ["superadmin", "manager"],
    },
    {
      path: "/reports",
      label: "Reports",
      icon: FileText,
      roles: ["superadmin", "manager", "employee"],
    },
  ];

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside
      className={`
      ${
        isMobile
          ? "fixed inset-0 z-50 h-full w-full"
          : "hidden lg:flex flex-col sticky top-[66px] h-[calc(100vh-72px)] w-64"
      }
      /* MONOCHROME THEME: Dark Gray to Black background */
      bg-[#1E2939] text-white shadow-2xl border-r border-white/5
    `}
    >
      {/* 1. Profile Section */}
      <div className="p-6 border-b border-white/5 flex-shrink-0">
        <Link
          to="/employee-dashboard"
          onClick={isMobile ? onClose : undefined}
          className="block group"
        >
          <div className="flex items-center gap-3 p-2 rounded-xl transition-all duration-300 hover:bg-white/5">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-[#1E2939] flex items-center justify-center font-bold text-xl text-white border border-white/10 shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#1a1a1a] rounded-full"></div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white leading-tight truncate">
                {user?.name || "User"}
              </p>
              <span className="text-[10px] bg-white/10 text-neutral-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
        <ul className="space-y-1.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={isMobile ? onClose : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    active
                      ? "bg-white text-black shadow-lg"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  <span className="font-medium text-sm tracking-wide">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 3. Footer / System Status */}
      {user?.role === "superadmin" && (
        <div className="p-4 pb-10 mt-auto flex-shrink-0">
          <div className="bg[#1E2939] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={14} className="text-neutral-400" />
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                System Security
              </p>
            </div>
            <p className="text-xs text-neutral-300 font-medium">
              Super Admin Mode Active
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
