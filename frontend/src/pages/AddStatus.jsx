import { useEffect, useState } from "react";
import { Trash2, Edit2, Check, X, Plus, AlertCircle } from "lucide-react";
import api from "../services/api";

const AddStatus = () => {
  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch statuses
  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/attendance/status");
      setStatuses(data);
      setError("");
    } catch (err) {
      setError("Failed to load statuses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  // Add status
  const handleAdd = async () => {
    if (!newStatus.trim()) {
      setError("Status name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await api.post("/attendance/status", { name: newStatus.trim() });
      setNewStatus("");
      setError("");
      fetchStatuses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add status");
    } finally {
      setLoading(false);
    }
  };

  // Delete status
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this status?")) return;

    try {
      setLoading(true);
      await api.delete(`/attendance/status/${id}`);
      setError("");
      fetchStatuses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete status");
      setLoading(false);
    }
  };

  // Update status
  const handleUpdate = async (id) => {
    if (!editingName.trim()) {
      setError("Status name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/attendance/status/${id}`, {
        name: editingName.trim(),
      });

      setEditingId(null);
      setEditingName("");
      setError("");
      fetchStatuses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {" "}
        {/* Responsive container with max-width cap */}
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Attendance Status Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Create and manage attendance status options
          </p>
        </div>
        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
            <AlertCircle
              className="text-red-500 flex-shrink-0 mt-0.5"
              size={18}
            />
            <div className="flex-1 min-w-0">
              <p className="text-red-800 font-medium text-sm">Error</p>
              <p className="text-red-600 text-xs sm:text-sm truncate">
                {error}
              </p>
            </div>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-400 hover:text-red-600 p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {/* Add Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Add New Status
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {" "}
            {/* Stack on mobile */}
            <input
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAdd)}
              placeholder="Enter status name (e.g., Present, Absent, Late)"
              className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={loading}
            />
            <button
              onClick={handleAdd}
              disabled={loading || !newStatus.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm w-full sm:w-auto"
            >
              <Plus size={18} />
              Add Status
            </button>
          </div>
        </div>
        {/* Status List Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Existing Statuses ({statuses.length})
          </h2>

          {loading && statuses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Loading statuses...
            </div>
          ) : statuses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No statuses found. Add your first status above.
            </div>
          ) : (
            <ul className="space-y-3">
              {statuses.map((status, index) => (
                <li
                  key={status._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow"
                >
                  {editingId === status._id ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) =>
                          handleKeyPress(e, () => handleUpdate(status._id))
                        }
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
                        autoFocus
                        disabled={loading}
                      />
                      <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-start sm:justify-end">
                        <button
                          onClick={() => handleUpdate(status._id)}
                          disabled={loading || !editingName.trim()}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors flex-shrink-0"
                          title="Save"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingName("");
                            setError("");
                          }}
                          disabled={loading}
                          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors flex-shrink-0"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-2 sm:mb-0 flex-1 min-w-0">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 text-[darkgray] rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-800 font-medium text-sm truncate">
                          {status.name}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => {
                            setEditingId(status._id);
                            setEditingName(status.name);
                            setError("");
                          }}
                          disabled={loading}
                          className="text-blue-600 hover:bg-blue-50 disabled:text-gray-400 p-2 rounded-lg transition-colors flex-shrink-0"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(status._id)}
                          disabled={loading}
                          className="text-red-600 hover:bg-red-50 disabled:text-gray-400 p-2 rounded-lg transition-colors flex-shrink-0"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStatus;
