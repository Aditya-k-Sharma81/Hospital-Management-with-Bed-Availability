import React, { useContext, useEffect, useState } from "react";
import { StaffContext } from "../../context/StaffContext";

export default function Staff_Dashboard() {
  const { sToken, beds, users, getAllBeds, getAllUsers, allocateBed } = useContext(StaffContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBed, setSelectedBed] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");


  useEffect(() => {
    if (sToken) {
      getAllBeds();
      getAllUsers();
    }
  }, [sToken]);

  // Calculate Bed Stats
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === "occupied").length;
  const availableBeds = beds.filter((b) => b.status === "available").length;

  const handleAllocateClick = (user) => {
    setSelectedUser(user);
    setSelectedBed("");
    setDischargeDate("");

    setShowModal(true);
  };

  const handleConfirmAllocation = async () => {
    if (selectedUser && selectedBed && dischargeDate) {
      const success = await allocateBed(selectedBed, selectedUser.userData._id, dischargeDate);
      if (success) {
        setShowModal(false);
        setSelectedUser(null);
        setSelectedBed("");
        setDischargeDate("");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full relative">
      {/* ===== HEADER ===== */}
      <h1 className="text-2xl font-semibold mb-6">Reception / Staff Dashboard</h1>

      {/* ===== BED STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Beds</p>
          <h2 className="text-3xl font-bold">{totalBeds}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Occupied Beds</p>
          <h2 className="text-3xl font-bold text-red-500">{occupiedBeds}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Available Beds</p>
          <h2 className="text-3xl font-bold text-green-600">
            {availableBeds}
          </h2>
        </div>
      </div>

      {/* ===== USER TABLE ===== */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Patient / User List</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Action / Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isAdmitted = beds.some((b) => b.userId === user._id);

                return (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.userData.name}</td>
                    <td className="p-3">{user.userData.email}</td>
                    <td className="p-3">{user.userData.phone}</td>
                    <td className="p-3">
                      {isAdmitted ? (
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            Admitted - Bed {beds.find((b) => b.userId === user._id)?.bedNumber}
                          </span>
                          <span className="text-xs text-gray-500">
                            Discharge: {new Date(beds.find((b) => b.userId === user._id)?.dischargeDate).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        user.admissionStatus === "Discharged" ? (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
                            Discharged
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAllocateClick(user)}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            Allocate Bed
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== ALLOCATION MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Allocate Bed</h2>
            <p className="mb-4 text-gray-600">
              Assign a bed for <strong>{selectedUser?.name}</strong>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Available Bed
              </label>
              <select
                value={selectedBed}
                onChange={(e) => setSelectedBed(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">-- Select Bed --</option>
                {beds
                  .filter((b) => b.status === "available")
                  .map((bed) => (
                    <option key={bed._id} value={bed._id}>
                      {bed.bedNumber} ({bed.wardType})
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discharge Date & Time
              </label>
              <input
                type="datetime-local"
                value={dischargeDate}
                onChange={(e) => setDischargeDate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAllocation}
                disabled={!selectedBed || !dischargeDate}
                className={`px-4 py-2 rounded text-white ${!selectedBed || !dischargeDate
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}