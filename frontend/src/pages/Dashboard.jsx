import { useEffect, useState, useMemo, useRef } from "react";
import {
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  DollarSign,
  IndianRupee,
} from "lucide-react";
import api from "../services/api";
import { formatDate } from "../utils/formatDate";
// 1. Centralized status enum and normalization
const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  HALF_DAY: "half-day",
  LEAVE: "leave",
};
// Salary mapping based on designation
const DESIGNATION_SALARY = {
  "Web Developer": 15000,
  "Digital Marketing Executive": 15000,
  Cinematographer: 15000,
  "Video Editor": 15000,
  "Project and Sales Manager": 40000,
  "Sales Manager": 3000,
  Manager: 35000,
  "Sales Executive": 15000,
  "Business Development Executive": 20000,
  Accountant: 10000,
  "Social Media Manager": 15000,
  "Shopify and Wordpress Developer": 12000,
};
const normalizeStatus = (status) => {
  const normalized = status?.toLowerCase().trim();
  return Object.values(ATTENDANCE_STATUS).includes(normalized)
    ? normalized
    : null;
};
// 3. Consistent date normalization
const normalizeDate = (dateString) => {
  if (!dateString) return null;
  return dateString.split("T")[0];
};
// 8. Consistent employee name fallback
const FALLBACK_EMPLOYEE_NAME = "Unassigned Employee";
const getEmployeeName = (employee) => {
  return employee?.name?.trim() || FALLBACK_EMPLOYEE_NAME;
};
// Get salary based on designation
const getSalaryByDesignation = (designation) => {
  return DESIGNATION_SALARY[designation] || 0;
};
// Currency formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
// Reusable function for sorting (extracted for DRY)
const sortByEfficiency = (entries) => {
  return entries.sort((a, b) => {
    const getRate = (item) =>
      item[1].total > 0
        ? (item[1].effectiveDays / (item[1].total - item[1].leave)) * 100
        : 0;
    return getRate(b) - getRate(a) || a[0].localeCompare(b[0]);
  });
};
// Reusable efficiency calc
const getEfficiencyRate = (stats) => {
  const workingDays = stats.total - stats.leave;
  return workingDays > 0
    ? Math.round((stats.effectiveDays / workingDays) * 100)
    : 0;
};
const Dashboard = () => {
  const [rawAttendanceRecords, setRawAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  // Pagination state for Attendance Summary
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Configurable if needed
  // Pagination state for Attendance History
  const [currentPageHistory, setCurrentPageHistory] = useState(1);
  const itemsPerPageHistory = 5; // Number of dates per page (configurable)
  // Refs for smooth scrolling on page changes
  const summaryRef = useRef(null);
  const historyRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem("user"));
        setUser(currentUser);
        if (!currentUser) return;
        // Fetch attendance records
        const attendanceRes =
          currentUser.role === "superadmin" || currentUser.role === "manager"
            ? await api.get("/attendance")
            : await api.get("/attendance/me");
        // Fetch employee data for designation information
        let employeeData = [];
        if (
          currentUser.role === "superadmin" ||
          currentUser.role === "manager"
        ) {
          try {
            const employeeRes = await api.get("/users");
            employeeData = employeeRes.data;
          } catch (err) {
            console.error("Failed to fetch employees:", err);
          }
        } else {
          // For regular employees, just use their own data
          employeeData = [currentUser];
        }
        setEmployees(employeeData);
        // Filter out admin/owner and normalize data
        const filteredData = attendanceRes.data
          .filter((record) => record.employee?.role !== "superadmin")
          .map((record) => ({
            ...record,
            normalizedStatus: normalizeStatus(record.status),
            normalizedDate: normalizeDate(record.date),
            employeeName: getEmployeeName(record.employee),
            employeeId: record.employee?._id,
            designation: record.employee?.designation,
          }))
          // 2. Sort by date (newest first) immediately after fetching
          .sort((a, b) => {
            const dateA = new Date(a.date || 0);
            const dateB = new Date(b.date || 0);
            return dateB - dateA;
          });
        setRawAttendanceRecords(filteredData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
    setCurrentPageHistory(1);
  }, [fromDate, toDate]);
  // Filtered records based on date range
  const filteredRecords = useMemo(() => {
    if (!fromDate && !toDate) return rawAttendanceRecords;
    return rawAttendanceRecords.filter((record) => {
      const date = record.normalizedDate;
      if (fromDate && date < fromDate) return false;
      if (toDate && date > toDate) return false;
      return true;
    });
  }, [rawAttendanceRecords, fromDate, toDate]);
  // Create a map of employee designations and salaries
  const employeeSalaryMap = useMemo(() => {
    const map = {};
    employees.forEach((emp) => {
      const monthlySalary = getSalaryByDesignation(emp.designation);
      map[emp._id] = {
        designation: emp.designation,
        monthlySalary: monthlySalary,
        dailyRate: monthlySalary / 30, // Assuming 30 working days per month
        name: emp.name,
      };
    });
    return map;
  }, [employees]);
  // 12. Use derived data objects with useMemo for performance
  const derivedData = useMemo(() => {
    // Group by date
    const recordsByDate = filteredRecords.reduce((acc, record) => {
      const date = record.normalizedDate;
      if (!date) return acc;
      if (!acc[date]) acc[date] = [];
      acc[date].push(record);
      return acc;
    }, {});
    // 10. Detect duplicate records per employee per day
    const duplicateWarnings = [];
    Object.entries(recordsByDate).forEach(([date, records]) => {
      const employeeCounts = {};
      records.forEach((record) => {
        const name = record.employeeName;
        employeeCounts[name] = (employeeCounts[name] || 0) + 1;
      });
      Object.entries(employeeCounts).forEach(([name, count]) => {
        if (count > 1) {
          duplicateWarnings.push({ date, employee: name, count });
        }
      });
    });
    // Employee summary with half-day handling and salary calculation
    const summaryByEmployee = filteredRecords.reduce((acc, record) => {
      const name = record.employeeName;
      const employeeId = record.employeeId;
      const designation = record.designation;
      if (!acc[name]) {
        const salaryInfo = employeeSalaryMap[employeeId] || {
          designation: designation,
          monthlySalary: getSalaryByDesignation(designation),
          dailyRate: getSalaryByDesignation(designation) / 30,
        };
        acc[name] = {
          present: 0,
          absent: 0,
          halfDay: 0,
          leave: 0,
          total: 0,
          effectiveDays: 0, // present + (halfDay * 0.5)
          designation: salaryInfo.designation,
          monthlySalary: salaryInfo.monthlySalary,
          dailyRate: salaryInfo.dailyRate,
          calculatedEarnings: 0,
          employeeId: employeeId,
        };
      }
      const status = record.normalizedStatus;
      if (status === ATTENDANCE_STATUS.PRESENT) {
        acc[name].present++;
        acc[name].effectiveDays += 1;
      } else if (status === ATTENDANCE_STATUS.ABSENT) {
        acc[name].absent++;
      } else if (status === ATTENDANCE_STATUS.HALF_DAY) {
        acc[name].halfDay++;
        acc[name].effectiveDays += 0.5; // 9. Half-day = 0.5 present
      } else if (status === ATTENDANCE_STATUS.LEAVE) {
        acc[name].leave++;
      }
      acc[name].total++;
      return acc;
    }, {});
    // Calculate earnings for each employee
    Object.keys(summaryByEmployee).forEach((name) => {
      const employee = summaryByEmployee[name];
      // Earnings = Daily Rate × Effective Days (present + half-day*0.5)
      employee.calculatedEarnings = employee.dailyRate * employee.effectiveDays;
    });
    // Statistics
    const totalEntries = filteredRecords.length;
    const totalPresent = filteredRecords.filter(
      (r) => r.normalizedStatus === ATTENDANCE_STATUS.PRESENT,
    ).length;
    const totalAbsent = filteredRecords.filter(
      (r) => r.normalizedStatus === ATTENDANCE_STATUS.ABSENT,
    ).length;
    const totalHalfDay = filteredRecords.filter(
      (r) => r.normalizedStatus === ATTENDANCE_STATUS.HALF_DAY,
    ).length;
    const totalLeave = filteredRecords.filter(
      (r) => r.normalizedStatus === ATTENDANCE_STATUS.LEAVE,
    ).length;
    // 4. Total unique days with attendance data (recorded working days)
    const recordedDays = Object.keys(recordsByDate).length;
    // 6. Attendance rate calculation (excluding leave from denominator)
    const workingDays = totalPresent + totalAbsent + totalHalfDay;
    const effectivePresent = totalPresent + totalHalfDay * 0.5;
    const attendanceRate =
      workingDays > 0
        ? ((effectivePresent / workingDays) * 100).toFixed(1)
        : "0.0";
    // Calculate total earnings across all employees
    const totalEarnings = Object.values(summaryByEmployee).reduce(
      (sum, emp) => sum + emp.calculatedEarnings,
      0,
    );
    return {
      recordsByDate,
      summaryByEmployee,
      stats: {
        totalEntries,
        totalPresent,
        totalAbsent,
        totalHalfDay,
        totalLeave,
        recordedDays,
        attendanceRate,
        effectivePresent,
        workingDays,
        totalEarnings,
      },
      duplicateWarnings,
    };
  }, [filteredRecords, employeeSalaryMap]);
  const { recordsByDate, summaryByEmployee, stats, duplicateWarnings } =
    derivedData;
  // Pagination logic for Attendance Summary
  const sortedEntries = useMemo(() => {
    return sortByEfficiency(Object.entries(summaryByEmployee));
  }, [summaryByEmployee]);
  const totalItems = sortedEntries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntries = sortedEntries.slice(startIndex, endIndex);
  const currentStart = startIndex + 1;
  const currentEnd = Math.min(endIndex, totalItems);
  // Pagination logic for Attendance History
  const sortedDates = useMemo(() => {
    return Object.keys(recordsByDate).sort((a, b) => new Date(b) - new Date(a));
  }, [recordsByDate]);
  const totalDates = sortedDates.length;
  const totalPagesHistory = Math.ceil(totalDates / itemsPerPageHistory);
  const startIndexHistory = (currentPageHistory - 1) * itemsPerPageHistory;
  const endIndexHistory = startIndexHistory + itemsPerPageHistory;
  const paginatedDates = sortedDates.slice(startIndexHistory, endIndexHistory);
  const currentStartHistory = startIndexHistory + 1;
  const currentEndHistory = Math.min(endIndexHistory, totalDates);
  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
    setCurrentPageHistory(1);
  }, [summaryByEmployee, recordsByDate]);
  // Smooth scroll functions for pagination
  const handleSummaryPageChange = (newPage) => {
    setCurrentPage(newPage);
    summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleHistoryPageChange = (newPage) => {
    setCurrentPageHistory(newPage);
    historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const getStatusColor = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.PRESENT:
        return "bg-green-100 text-[gray] border-green-200";
      case ATTENDANCE_STATUS.ABSENT:
        return "bg-red-100 text-red-800 border-red-200";
      case ATTENDANCE_STATUS.HALF_DAY:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ATTENDANCE_STATUS.LEAVE:
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.PRESENT:
        return <CheckCircle className="w-4 h-4" />;
      case ATTENDANCE_STATUS.ABSENT:
        return <XCircle className="w-4 h-4" />;
      case ATTENDANCE_STATUS.HALF_DAY:
        return <Clock className="w-4 h-4" />;
      case ATTENDANCE_STATUS.LEAVE:
        return <Calendar className="w-4 h-4" />;
      default:
        return null;
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-[gradient-to-br from-blue-50 via-white to-purple-50] flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <div
      className="dashboard-bg min-h-screen bg-[#e8e8e8] p-2 sm:p-4 md:p-6 lg:p-8 w-full max-w-full"
      style={{ borderRadius: "10px" }}
    >
      {/* rgb(124 40 142 / 38%) */}
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8 w-full">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-words">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 break-words max-w-full">
          {user?.role === "superadmin" || user?.role === "manager"
            ? "Overview of all employee records"
            : "Your attendance overview"}
        </p>
      </div>
      {/* 10. Show duplicate warnings if any */}
      {duplicateWarnings.length > 0 && (
        <div className="mb-4 sm:mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 w-full">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-yellow-900 mb-1 text-sm sm:text-base break-words">
                Duplicate Records Detected
              </h3>
              <p className="text-sm text-yellow-800 break-words">
                {duplicateWarnings.length} date(s) have multiple records for the
                same employee. This may affect statistics.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Statistics Cards - 2 columns on all small screens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5 sm:gap-2.5 mb-4 sm:mb-6 w-full">
        {[
          {
            label: "Total Entries",
            value: stats.totalEntries,
            icon: BarChart3,
            color: "gray",
          },
          {
            label: "Present",
            value: stats.totalPresent,
            icon: CheckCircle,
            color: "gray",
          },
          {
            label: "Absent",
            value: stats.totalAbsent,
            icon: XCircle,
            color: "gray",
          },
          {
            label: "Recorded Days",
            value: stats.recordedDays,
            icon: Calendar,
            color: "gray",
          },
          {
            label: "Attendance Rate",
            value: `${stats.attendanceRate}%`,
            icon: TrendingUp,
            color: "gray",
          },
          // Conditional logic for Earnings included in the map or as a separate item
          ...(user?.role === "superadmin" || user?.role === "manager"
            ? [
                {
                  label: "Total Expenditure",
                  value: formatCurrency(stats.totalEarnings),
                  icon: IndianRupee,
                  color: "gray",
                },
              ]
            : []),
        ].map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md border border-gray-100 overflow-hidden w-full max-w-full"
          >
            {/* Subtle background accent blur */}
            <div
              className={`absolute -right-1 sm:-right-2 -top-1 sm:-top-2 w-8 sm:w-10 h-8 sm:h-10 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity bg-${stat.color}-600`}
            />
            <div className="flex flex-col gap-2 relative z-10 w-full">
              <div
                className={`w-8 sm:w-9 h-8 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 transition-colors group-hover:bg-${stat.color}-100`}
              >
                <stat.icon
                  size={16}
                  sm:size={18}
                  strokeWidth={2}
                  sm:strokewidth={2.5}
                />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1 break-words text-gray-700">
                  {stat.label}
                </p>
                <p className="text-base sm:text-lg lg:text-xl font-extrabold text-gray-700 tracking-tight break-words">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Attendance Summary */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 mb-6 sm:mb-8 overflow-hidden transition-all duration-300 hover:shadow-md w-full max-w-full">
        {/* 1. Enhanced Header Section */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/40 flex flex-col gap-3 sm:gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-[darkgray] rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-100">
              <Users className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight leading-none break-words">
                Employee Summary
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-medium flex items-center gap-1.5 break-words">
                <span className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></span>
                Performance & Earnings Insights
              </p>
            </div>
          </div>
          {/* Date Range Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end w-full">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium break-words">
                Filter by date range (leave empty for all data)
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                  From
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm bg-white shadow-sm min-w-0"
                />
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                  To
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm bg-white shadow-sm min-w-0"
                />
              </div>
            </div>
          </div>
        </div>
        {Object.keys(summaryByEmployee).length === 0 ? (
          <div className="py-16 sm:py-24 text-center w-full">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <Users className="w-8 sm:w-10 h-8 sm:h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-bold text-sm sm:text-base break-words">
              No data captured yet
            </p>
            <p className="text-sm text-gray-400 mt-1 break-words">
              Summary will generate automatically
            </p>
          </div>
        ) : (
          <>
            {/* Content ref for smooth scrolling */}
            <div ref={summaryRef} className="w-full">
              {/* 2. Desktop Table View - Refined */}
              <div className="hidden sm:block overflow-x-auto w-full">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-gray-50/80 backdrop-blur-sm">
                      <th className="sticky left-0 bg-gray-50/80 px-4 sm:px-6 py-3 sm:py-4 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">
                        Employee
                      </th>
                      {(user?.role === "superadmin" ||
                        user?.role === "manager") && (
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 hidden md:table-cell">
                          Role
                        </th>
                      )}
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 text-center hidden lg:table-cell">
                        Presence (P/H/A/L)
                      </th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 text-center">
                        Days
                      </th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">
                        Efficiency
                      </th>
                      {(user?.role === "superadmin" ||
                        user?.role === "manager") && (
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 text-right">
                          Total Expenditure
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedEntries.map(([name, stats]) => {
                      const rate = getEfficiencyRate(stats);
                      return (
                        <tr
                          key={name}
                          className="group transition-colors hover:bg-indigo-50/20"
                        >
                          <td className="sticky left-0 bg-white group-hover:bg-indigo-50/1 transition-colors px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap border-b border-transparent">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg sm:rounded-xl bg-[darkgray] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-100">
                                {name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col min-w-0 flex-1">
                                <span
                                  className={`text-sm font-bold break-words ${
                                    name === FALLBACK_EMPLOYEE_NAME
                                      ? "text-gray-400 italic"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {name}
                                </span>
                                <span className="text-xs text-indigo-500 font-bold md:hidden break-words">
                                  {stats.designation || "Staff"}
                                </span>
                              </div>
                            </div>
                          </td>
                          {(user?.role === "superadmin" ||
                            user?.role === "manager") && (
                            <td className="px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell border-b border-transparent">
                              <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 px-1.5 sm:px-2 py-1 rounded-lg uppercase tracking-tight break-words">
                                {stats.designation || "Staff"}
                              </span>
                            </td>
                          )}
                          <td className="px-3 sm:px-4 py-3 sm:py-4 hidden lg:table-cell text-center border-b border-transparent">
                            <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                              <span className="text-emerald-600 font-bold text-xs">
                                {stats.present}
                              </span>
                              <span className="text-gray-300 font-light text-xs">
                                |
                              </span>
                              <span className="text-blue-500 font-bold text-xs">
                                {stats.halfDay}
                              </span>
                              <span className="text-gray-300 font-light text-xs">
                                |
                              </span>
                              <span className="text-red-400 font-bold text-xs">
                                {stats.absent}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-sm font-extrabold text-gray-700 border-b border-transparent">
                            {stats.total}
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4 border-b border-transparent">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-12 sm:w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden hidden lg:block border border-gray-200/50">
                                <div
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    rate >= 90
                                      ? "bg-emerald-500"
                                      : rate >= 75
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                  }`}
                                  style={{ width: `${rate}%` }}
                                />
                              </div>
                              <span
                                className={`text-xs font-black px-1.5 sm:px-2 py-0.5 rounded-lg border shadow-sm break-words ${
                                  rate >= 90
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : rate >= 75
                                      ? "bg-amber-50 text-amber-700 border-amber-100"
                                      : "bg-rose-50 text-rose-700 border-rose-100"
                                }`}
                              >
                                {rate}%
                              </span>
                            </div>
                          </td>
                          {(user?.role === "superadmin" ||
                            user?.role === "manager") && (
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-right border-b border-transparent">
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-black text-indigo-700 break-words">
                                  {stats.calculatedEarnings > 0
                                    ? formatCurrency(stats.calculatedEarnings)
                                    : "—"}
                                </span>
                                <span className="text-xs font-bold text-gray-400 tracking-tighter break-words">
                                  {stats.dailyRate > 0
                                    ? `@${formatCurrency(stats.dailyRate)}`
                                    : "No Rate"}
                                </span>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* 3. Mobile Card View - List Style Enhancement */}
              <div className="sm:hidden divide-y divide-gray-50 bg-gray-50/30 w-full">
                {paginatedEntries.map(([name, stats]) => {
                  const rate = getEfficiencyRate(stats);
                  return (
                    <div
                      key={name}
                      className="p-4 sm:p-5 hover:bg-white transition-all bg-white/60 w-full"
                    >
                      <div className="flex items-start justify-between mb-3 sm:mb-4 w-full">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl sm:rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-100 flex-shrink-0">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`font-black text-gray-900 break-words ${
                                name === FALLBACK_EMPLOYEE_NAME
                                  ? "text-gray-400 italic font-medium"
                                  : ""
                              }`}
                            >
                              {name}
                            </p>
                            <span className="text-xs sm:text-[10px] font-bold text-indigo-500 uppercase tracking-widest break-words">
                              {stats.designation || "Staff"}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-900 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-center min-w-[45px] sm:min-w-[50px] shadow-sm flex-shrink-0">
                          <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">
                            Days
                          </p>
                          <p className="text-sm font-black leading-none">
                            {stats.total}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:gap-4 bg-white border border-gray-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm w-full">
                        <div className="flex-1 border-r border-gray-50 pr-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1 break-words">
                            Efficiency
                          </p>
                          <div className="flex items-center gap-2 w-full">
                            <span
                              className={`text-sm font-black break-words ${
                                rate >= 90
                                  ? "text-emerald-600"
                                  : rate >= 75
                                    ? "text-amber-600"
                                    : "text-rose-600"
                              }`}
                            >
                              {rate}%
                            </span>
                            <div className="flex-1 bg-gray-100 h-1 rounded-full max-w-[35px] sm:max-w-[40px]">
                              <div
                                className={`h-full rounded-full ${
                                  rate >= 90
                                    ? "bg-emerald-500"
                                    : rate >= 75
                                      ? "bg-amber-500"
                                      : "bg-rose-500"
                                }`}
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        {(user?.role === "superadmin" ||
                          user?.role === "manager") && (
                          <div className="flex-1 pl-1 sm:pl-2 min-w-0">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1 break-words">
                              Total Pay
                            </p>
                            <p className="text-sm font-black text-indigo-700 truncate break-words">
                              {stats.calculatedEarnings > 0
                                ? formatCurrency(stats.calculatedEarnings)
                                : "—"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* 4. Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50/50 border-t border-gray-100 w-full">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
                  <span className="text-xs sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest break-words text-center sm:text-left">
                    Showing {currentStart}-{currentEnd} of {totalItems}
                  </span>
                  <div className="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto justify-center sm:justify-normal">
                    <button
                      onClick={() =>
                        handleSummaryPageChange(Math.max(currentPage - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-2 sm:px-2 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-40 transition-all hover:border-indigo-300 hover:text-indigo-600 shadow-sm text-xs font-bold uppercase flex-shrink-0"
                    >
                      <span className="px-1 sm:px-2">Prev</span>
                    </button>
                    <button
                      onClick={() =>
                        handleSummaryPageChange(
                          Math.min(currentPage + 1, totalPages),
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="px-2 sm:px-2 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-40 transition-all hover:border-indigo-300 hover:text-indigo-600 shadow-sm text-xs font-bold uppercase flex-shrink-0"
                    >
                      <span className="px-1 sm:px-2">Next</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Attendance History */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-full">
        {/* Modern Header with Gradient Accent */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50 w-full">
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-[darkgray] rounded-lg shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-none break-words">
                Attendance History
              </h2>
              <p className="text-xs text-gray-500 mt-1.5 font-medium break-words">
                Detailed log of daily employee presence
              </p>
            </div>
          </div>
        </div>
        {Object.keys(recordsByDate).length === 0 ? (
          <div className="py-16 sm:py-20 text-center w-full">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <Calendar className="w-8 sm:w-10 h-8 sm:h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium text-sm sm:text-base break-words">
              No attendance records found
            </p>
            <p className="text-sm text-gray-400 break-words">
              Records will appear here once submitted.
            </p>
          </div>
        ) : (
          <>
            {/* Content ref for smooth scrolling */}
            <div
              ref={historyRef}
              className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto w-full"
            >
              {paginatedDates.map((date) => (
                <div
                  key={date}
                  className="group hover:bg-gray-50/50 transition-all duration-300 w-full"
                >
                  {/* Sticky Date Header for Better Navigation */}
                  <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 border-y border-gray-50 flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-1.5 h-5 bg-blue-600 rounded-full flex-shrink-0" />
                      <h3 className="text-sm font-bold text-gray-800 tracking-tight break-words flex-1 min-w-0">
                        {formatDate(date)}
                      </h3>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0">
                      {recordsByDate[date].length}{" "}
                      {recordsByDate[date].length === 1 ? "Record" : "Records"}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4 sm:p-6 space-y-2 sm:space-y-3 w-full">
                    {recordsByDate[date].map((r) => (
                      <div
                        key={r._id}
                        className={`group/item flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 w-full ${getStatusColor(
                          r.normalizedStatus,
                        )}`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-0 min-w-0 flex-1 w-full">
                          {/* Character Avatar with Shadow */}
                          <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg sm:rounded-xl bg-white shadow-sm flex items-center justify-center text-sm font-bold text-gray-700 flex-shrink-0 border border-gray-100 group-hover/item:scale-110 transition-transform">
                            {r.employeeName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span
                              className={`font-bold text-sm truncate break-words ${
                                r.employeeName === FALLBACK_EMPLOYEE_NAME
                                  ? "italic text-gray-500 font-medium"
                                  : "text-gray-900"
                              }`}
                            >
                              {r.employeeName}
                            </span>
                            <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-0.5 break-words">
                              ID: {r._id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {/* Status Badge */}
                        <div className="flex items-center gap-2 self-start sm:self-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white shadow-sm flex-shrink-0">
                          <div className="scale-110">
                            {getStatusIcon(r.normalizedStatus)}
                          </div>
                          <span className="text-xs text-[gray] font-extrabold uppercase tracking-tight break-words">
                            {r.normalizedStatus || "Unknown"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination for History */}
            {totalPagesHistory > 1 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50/50 border-t border-gray-100 w-full">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
                  <span className="text-xs sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest break-words text-center sm:text-left">
                    Showing {currentStartHistory}-{currentEndHistory} of{" "}
                    {totalDates} dates
                  </span>
                  <div className="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto justify-center sm:justify-normal">
                    <button
                      onClick={() =>
                        handleHistoryPageChange(
                          Math.max(currentPageHistory - 1, 1),
                        )
                      }
                      disabled={currentPageHistory === 1}
                      className="px-2 sm:px-2 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-40 transition-all hover:border-indigo-300 hover:text-indigo-600 shadow-sm text-xs font-bold uppercase flex-shrink-0"
                    >
                      <span className="px-1 sm:px-2">Prev</span>
                    </button>
                    <button
                      onClick={() =>
                        handleHistoryPageChange(
                          Math.min(currentPageHistory + 1, totalPagesHistory),
                        )
                      }
                      disabled={currentPageHistory === totalPagesHistory}
                      className="px-2 sm:px-2 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-40 transition-all hover:border-indigo-300 hover:text-indigo-600 shadow-sm text-xs font-bold uppercase flex-shrink-0"
                    >
                      <span className="px-1 sm:px-2">Next</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
