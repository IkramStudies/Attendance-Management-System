import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../services/api.js"; // adjust path if needed

const EmployeeModal = ({ isOpen, onClose, onSave, employee = null }) => {
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee",
    department: "",
    password: "",
  });

  // 🔹 Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/department");
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to load departments", err);
      }
    };

    fetchDepartments();
  }, []);

  // 🔹 Populate form when editing
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department?._id || employee.department || "",
        password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "employee",
        department: "",
        password: "",
      });
    }
  }, [employee, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {employee ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium">Full Name</label>
              <input
                required
                type="text"
                className="w-full border rounded-lg p-2.5"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium">Email Address</label>
              <input
                required
                type="email"
                className="w-full border rounded-lg p-2.5"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* ✅ Department dropdown (FIXED) */}
            <div>
              <label className="block text-sm font-medium">Department</label>
              <select
                required
                className="w-full border rounded-lg p-2.5"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                <option value="">Select...</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">System Role</label>
              <select
                className="w-full border rounded-lg p-2.5"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            {!employee && (
              <div className="col-span-2">
                <label className="block text-sm font-medium">
                  Temporary Password
                </label>
                <input
                  required
                  type="password"
                  className="w-full border rounded-lg p-2.5"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
          >
            {employee ? "Update Employee" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
