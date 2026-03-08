import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarCheck,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";

const EmployeeAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userRes, attendanceRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/attendance/employee/${id}`),
        ]);
        setEmployee(userRes.data);
        setAttendance(attendanceRes.data);
      } catch (err) {
        console.error("Error loading attendance:", err);
        setError("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Reset to page 1 when records per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [recordsPerPage]);

  // Pagination calculations
  const totalPages = Math.ceil(attendance.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = attendance.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600">Loading attendance...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => navigate("/employees")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Employees
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/employees")}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Employees</span>
        </button>

        {/* Employee Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-2xl">
                {employee?.name?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>

            {/* Employee Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {employee?.name} - Attendance History
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <span>{employee?.email}</span>
                </div>
                {employee?.role && (
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{employee.role}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {attendance.length}
              </div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        {attendance.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CalendarCheck size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No attendance records found</p>
            <p className="text-gray-500 text-sm mt-2">
              This employee hasn't checked in yet
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Records per page selector */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  value={recordsPerPage}
                  onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>records per page</span>
              </div>
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstRecord + 1} to{" "}
                {Math.min(indexOfLastRecord, attendance.length)} of{" "}
                {attendance.length} records
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentRecords.map((record) => (
                    <tr
                      key={record._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <CalendarCheck size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-800">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            record.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : record.status === "Absent"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 text-gray-500"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            page === currentPage
                              ? "bg-blue-600 text-white font-semibold"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendance;
