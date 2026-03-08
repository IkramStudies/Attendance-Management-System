import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import {
  getAttendanceByDate,
  markAttendance,
  updateAttendance,
  getAttendanceStatuses,
} from "../services/attendanceService.js";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Edit2,
  Save,
  X,
  UserCheck,
  AlertCircle,
  Users,
} from "lucide-react";

const Attendance = () => {
  const { user } = useAuth();

  // State Management
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [attendanceTaken, setAttendanceTaken] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const BASE_STATUSES = ["present", "absent", "half-day", "leave"];
  const [availableStatuses, setAvailableStatuses] = useState(BASE_STATUSES);

  /* ======================
      FETCH DATA
  ====================== */

  useEffect(() => {
    const initializeData = async () => {
      const dbStatuses = await fetchStatuses();
      fetchAttendance(date, dbStatuses);
    };

    initializeData();
  }, [date]);

  const fetchStatuses = async () => {
    try {
      const data = await getAttendanceStatuses();
      const dbStatusNames = data.map((s) => s.name);
      const combined = Array.from(
        new Set([...BASE_STATUSES, ...dbStatusNames]),
      );
      setAvailableStatuses(combined);
      return combined;
    } catch (error) {
      console.error("Failed to fetch statuses", error);
      return BASE_STATUSES;
    }
  };

  const fetchAttendance = async (selectedDate, currentStatuses) => {
    try {
      setLoading(true);
      setError("");
      const res = await getAttendanceByDate(selectedDate);

      if (res.taken) {
        setAttendanceTaken(true);
        setAttendanceRecords(res.records);
        setStudents([]);
        setEditMode(false);
      } else {
        setAttendanceTaken(false);
        setAttendanceRecords([]);
        const defaultStatus = "present";

        setStudents(
          res.employees.map((e) => ({
            _id: e._id,
            name: e.name,
            status: defaultStatus, // Now empty/neutral
          })),
        );
      }
    } catch (error) {
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
      HANDLERS
  ====================== */

  const handleStatusChange = (id, status) => {
    if (attendanceTaken) {
      setAttendanceRecords((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r)),
      );
    } else {
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status } : s)),
      );
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const records = students.map((s) => ({
        employeeId: s._id,
        status: s.status,
        date,
      }));

      const res = await markAttendance(records);
      setAttendanceTaken(true);
      setAttendanceRecords(res);
      setStudents([]);
      showSuccess("Attendance marked successfully!");
    } catch (error) {
      setError("Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAll = async () => {
    try {
      setLoading(true);
      const updatePromises = attendanceRecords.map((r) =>
        updateAttendance(r._id, r.status),
      );
      await Promise.all(updatePromises);
      setEditMode(false);
      showSuccess("All changes saved successfully!");
    } catch (error) {
      setError("Failed to update some records.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "present") return "bg-white text-darkgray border-green-200";
    if (s === "absent") return "bg-white text-darkgray border-red-200";
    if (s === "half-day") return "bg-white text-darkgray border-yellow-200";
    if (s === "leave") return "bg-white text-darkgray border-blue-200";
    return "bg-white text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s === "present") return <CheckCircle size={14} />;
    if (s === "absent") return <XCircle size={14} />;
    if (s === "half-day") return <Clock size={14} />;
    return null;
  };

  const stats = (() => {
    const records = attendanceTaken ? attendanceRecords : students;
    return {
      total: records.length,
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      halfDay: records.filter((r) => r.status === "half-day").length,
      leave: records.filter((r) => r.status === "leave").length,
    };
  })();

  if (!user || !["superadmin", "manager"].includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-red-600 text-lg font-semibold">Not authorized</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Attendance
          </h1>
          <p className="text-gray-600">
            Track and manage employee daily records
          </p>
        </div>
        <UserCheck className="text-[gray] hidden sm:block" size={40} />
      </div>

      {/* Feedback Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} /> {successMessage}
          </div>
          <button onClick={() => setSuccessMessage("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
          <button onClick={() => setError("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Date Selector & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Select Date
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", val: stats.total, color: "border-gray-500" },
            {
              label: "Present",
              val: stats.present,
              color: "border-green-500 text-green-600",
            },
            {
              label: "Absent",
              val: stats.absent,
              color: "border-red-500 text-red-600",
            },
            {
              label: "Leave",
              val: stats.leave,
              color: "border-blue-500 text-blue-600",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-white p-3 rounded-xl shadow-sm border-l-4 ${s.color}`}
            >
              <p className="text-xs font-semibold text-gray-500 uppercase">
                {s.label}
              </p>
              <p className="text-xl font-bold">{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div
          className={`px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4 ${
            attendanceTaken ? "bg-blue-50" : "bg-green-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {attendanceTaken ? (
              <CheckCircle className="text-[darkgray]" />
            ) : (
              <Users className="text-green-600" />
            )}
            <h2 className="font-bold text-gray-800">
              {attendanceTaken ? "Attendance Recorded" : "Mark New Attendance"}
            </h2>
          </div>

          {attendanceTaken && (
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                editMode
                  ? "bg-gray text-red-700 hover:bg-red-200"
                  : "bg-[darkgray] text-white hover:bg-[gray]"
              }`}
            >
              {editMode ? (
                <>
                  <X size={16} /> Cancel
                </>
              ) : (
                <>
                  <Edit2 size={16} /> Edit Records
                </>
              )}
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <th className="px-6 py-4 font-semibold">Employee Name</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(attendanceTaken ? attendanceRecords : students).map(
                  (person) => (
                    <tr
                      key={person._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {person.employee?.name || person.name}
                      </td>
                      <td className="px-6 py-4 flex justify-center">
                        {!attendanceTaken || editMode ? (
                          <select
                            value={person.status}
                            onChange={(e) =>
                              handleStatusChange(person._id, e.target.value)
                            }
                            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            {availableStatuses.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusColor(
                              person.status,
                            )}`}
                          >
                            {getStatusIcon(person.status)} {person.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Action Footer */}
        {!loading && (students.length > 0 || editMode) && (
          <div className="p-6 bg-gray-50 border-t flex justify-end">
            {editMode ? (
              <button
                onClick={handleUpdateAll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all"
              >
                <Save size={18} /> Save All Changes
              </button>
            ) : (
              !attendanceTaken && (
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-green-200 transition-all"
                >
                  <CheckCircle size={18} /> Submit Attendance
                </button>
              )
            )}
          </div>
        )}

        {!loading && !attendanceTaken && students.length === 0 && (
          <div className="p-12 text-center">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No employees found for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
