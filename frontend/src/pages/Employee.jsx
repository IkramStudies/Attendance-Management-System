import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Mail,
  Calendar,
  UserPlus,
  Pencil,
  Trash2,
  Briefcase,
  CheckCircle2,
  Clock,
} from "lucide-react";
import api from "../services/api";
import EmployeeModal from "./EmployeeModal";

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isSuperAdmin = currentUser?.role === "superadmin";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/users");
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setLoading(false);
    }
  };

  const handleSaveEmployee = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department:
          typeof formData.department === "object"
            ? formData.department._id
            : formData.department,
      };

      // 🔐 Password handling (robust)
      if (!selectedEmployee) {
        const password =
          formData.password ||
          formData.tempPassword ||
          formData.temporaryPassword;

        if (!password) {
          alert("Temporary password is required");
          return;
        }

        payload.password = password;
      }

      if (selectedEmployee) {
        await api.put(`/users/${selectedEmployee._id}`, payload);
      } else {
        await api.post("/users", payload);
      }

      setModalOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving employee");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this employee permanently?")) {
      try {
        await api.delete(`/users/${id}`);
        setEmployees(employees.filter((emp) => emp._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const openEditModal = (e, emp) => {
    e.stopPropagation();
    setSelectedEmployee(emp);
    setModalOpen(true);
  };

  /**
   * Logic:
   * 1. If NOT verified -> Show "Pending" (Always)
   * 2. If Verified -> Show "Verified" badge if it happened in last 7 days.
   * 3. If Verified but NO 'verifiedAt' date exists -> Show "Verified" (Fallback for existing users)
   */
  const shouldShowVerifiedBadge = (emp) => {
    if (!emp.isEmailVerified) return false;
    if (!emp.verifiedAt) return true; // Show it if we don't know when they verified (older users)

    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return new Date() - new Date(emp.verifiedAt) < sevenDaysInMs;
  };

  const manageableEmployees = employees.filter(
    (emp) => emp.role !== "superadmin"
  );

  if (loading)
    return (
      <div className="p-10 text-center font-medium text-gray-500">
        Loading Staff...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-900">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-lg text-white shadow-blue-100 shadow-lg">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                Staff Management
              </h1>
              <p className="text-gray-500 text-sm">
                {manageableEmployees.length} Total Registered
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedEmployee(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md active:scale-95"
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline">Add Employee</span>
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {manageableEmployees.map((emp) => (
              <li
                key={emp._id}
                onClick={() => navigate(`/employees/${emp._id}/attendance`)}
                className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 group transition-colors"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-inner">
                  {emp.name.charAt(0)}
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="font-bold text-gray-800 truncate leading-tight">
                      {emp.name}
                    </h3>

                    {/* Department Badge (Handles null) */}
                    {emp.department && (
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-bold uppercase tracking-wider">
                        {typeof emp.department === "object"
                          ? emp.department.name
                          : emp.department}
                      </span>
                    )}

                    {/* Verification Status */}
                    {!emp.isEmailVerified ? (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-bold">
                        <Clock size={10} /> Pending
                      </span>
                    ) : (
                      shouldShowVerifiedBadge(emp) && (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-bold">
                          <CheckCircle2 size={10} /> Verified
                        </span>
                      )
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail size={12} className="text-gray-400" /> {emp.email}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <Briefcase size={12} className="text-gray-400" />{" "}
                      {emp.role}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-auto">
                  <button
                    onClick={(e) => openEditModal(e, emp)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, emp._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="pl-2 ml-2 border-l border-gray-100 text-blue-600 group-hover:translate-x-1 transition-transform">
                    <Calendar size={20} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default Employees;
