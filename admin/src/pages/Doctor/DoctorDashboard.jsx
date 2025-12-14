import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";

export default function DoctorDashboard() {
  const { getDoctorAppointment, dToken, backendUrl } = useContext(DoctorContext);
  const [appointments, setAppointments] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Form Fields
  const [disease, setDisease] = useState("");
  const [prescription, setPrescription] = useState("");
  const [bedNeeded, setBedNeeded] = useState("");

  // ========== FETCH APPOINTMENTS ==========
  const fetchAppointments = async () => {
    if (dToken) {
      const result = await getDoctorAppointment();
      if (result?.success) {
        setAppointments(result.appointments);
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, [dToken]);

  // ========== OPEN MODAL ==========
  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setDisease("");
    setPrescription("");
    setBedNeeded("");
    setShowModal(true);
  };

  // ========== CLOSE MODAL ==========
  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  // ========== SUBMIT RECEIPT ==========
  const handleSubmit = async () => {
    console.log("=== RECEIPT SUBMISSION ===");

    const userId = selectedAppointment?.userData?._id;
    const docId = selectedAppointment?.docData?._id;
    const appointmentId = selectedAppointment?._id;

    const receiptBody = {
      userId,
      docId,
      appointmentId,
      disease,
      prescription,
      bedNeeded,
    };

    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/reciept",
        receiptBody
      );

      console.log("API RESPONSE:", data);

      // ⭐ Refresh list instantly after marking completed
      await fetchAppointments();

    } catch (error) {
      console.error("API ERROR:", error.response?.data || error.message);
    }

    closeModal();
  };

  const doctorInfo = appointments.length > 0 ? appointments[0].docData : null;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen w-full flex justify-center">

      {/* MODAL CSS */}
      <style>
        {`
          .modal {
            display: flex;
            position: fixed;
            z-index: 50;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
            justify-content: center;
            align-items: center;
          }

          .modal-content {
            background-color: #fff;
            padding: 20px;
            border: 1px solid #888;
            width: 90%;
            max-width: 450px;
            max-height: 90vh;
            overflow-y: auto;
            border-radius: 10px;
            position: relative;
            animation: fadeIn 0.3s ease-in-out;
          }

          .modal-content::-webkit-scrollbar {
            display: none;
          }

          .close {
            color: #888;
            font-size: 28px;
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 20px;
          }

          .close:hover {
            color: black;
          }
        `}
      </style>

      <div className="w-full max-w-4xl">

        {/* Doctor Header */}
        {doctorInfo && (
          <div className="relative bg-white p-5 rounded-xl shadow-md flex flex-col md:flex-row gap-4 items-center">

            

            <img
              src={doctorInfo.image}
              alt="Doctor"
              className="w-24 h-24 rounded-full object-cover"
            />

            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{doctorInfo.name}</h1>
              <p className="text-gray-700">{doctorInfo.speciality}</p>
              <p className="text-gray-500">{doctorInfo.degree}</p>
              <p className="text-gray-500">{doctorInfo.experience}</p>
            </div>
          </div>
        )}

        {/* Appointment List */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Appointments</h2>

          {appointments
            .filter((appt) => !appt.cancelled)
            .map((appointment, index) => {
              const isCompleted = Boolean(appointment.isCompleted);

              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 mb-4"
                >
                  <img
                    src={appointment.userData.image}
                    alt="User"
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {appointment.userData.name}
                    </h3>
                    <p className="text-gray-600">Time: {appointment.slotTime}</p>
                    <p className="text-gray-600">Date: {appointment.slotDate}</p>
                    <p className="text-gray-600">Phone: {appointment.userData.phone}</p>
                  </div>

                  {/* Status */}
                  <div>
                    {isCompleted ? (
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => openModal(appointment)}
                        className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                      >
                        Upcoming
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ===================== MODAL ===================== */}
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>

            <h2 className="text-xl font-bold mb-4">Receipt Details</h2>

            {/* Readonly Fields */}
            <div className="mb-3">
              <label className="font-medium">Patient Name</label>
              <input
                type="text"
                value={selectedAppointment?.userData.name}
                readOnly
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            <div className="mb-3">
              <label className="font-medium">Phone Number</label>
              <input
                type="text"
                value={selectedAppointment?.userData.phone}
                readOnly
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            {/* Medical Inputs */}
            <h3 className="text-lg font-semibold mb-2">Medical Details</h3>

            <div className="mb-3">
              <label className="font-medium">Disease / Problem</label>
              <input
                type="text"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                placeholder="Eg: Fever, Cold"
              />
            </div>

            <div className="mb-3">
              <label className="font-medium">Prescription</label>
              <textarea
                rows="3"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                placeholder="Medicines with dosage"
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="font-medium">Bed Needed?</label>
              <select
                value={bedNeeded}
                onChange={(e) => setBedNeeded(e.target.value)}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="" disabled>Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Submit & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


