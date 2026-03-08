import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom"; // 1. Import Outlet

const DashboardLayout = () => {
  // 2. Remove children prop
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />
        {/* 3. Using Outlet allows nested routes like /add-status to appear here */}
        <main className="flex-1 p-6 bg-aliceblue">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
