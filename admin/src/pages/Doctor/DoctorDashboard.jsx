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
      await fetchAppointments();
    } catch (error) {
      console.error("API ERROR:", error.response?.data || error.message);
    }

    closeModal();
  };

  const doctorInfo = appointments.length > 0 ? appointments[0].docData : null;

  // Filter out cancelled appointments
  const activeAppointments = appointments.filter(appt => !appt.cancelled);

  return (
    <div className="bg-[#F8F9FD] w-full font-sans h-[calc(100vh-80px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-blue-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">

        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Doctor Dashboard</h1>
            <p className="text-gray-500 mt-2">Welcome back, manage your appointments and patients.</p>
          </div>

          {/* Doctor Profile Card (Mini) */}
          {doctorInfo && (
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
              <img
                src={doctorInfo.image}
                alt="Doctor"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
              />
              <div>
                <p className="font-bold text-gray-800 leading-tight">{doctorInfo.name}</p>
                <p className="text-xs text-blue-600 font-medium">{doctorInfo.speciality}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary (Optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Upcoming</div>
            <div className="text-2xl font-bold text-gray-800">{activeAppointments.filter(a => !a.isCompleted).length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-50">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Completed</div>
            <div className="text-2xl font-bold text-gray-800">{activeAppointments.filter(a => a.isCompleted).length}</div>
          </div>
        </div>


        {/* Appointments Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Today's Appointments
            <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{activeAppointments.length}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeAppointments.map((appointment, index) => {
              const isCompleted = Boolean(appointment.isCompleted);

              return (
                <div
                  key={index}
                  className={`group bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${isCompleted ? "border-gray-100 opacity-75" : "border-gray-100 hover:border-blue-200"
                    }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={appointment.userData.image}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-50"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {appointment.userData.name}
                        </h3>
                        <div className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md inline-block mt-1">
                          {appointment.userData.phone}
                        </div>
                      </div>
                    </div>

                    {isCompleted ? (
                      <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Done
                      </span>
                    ) : (
                      <span className="bg-yellow-50 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                        Upcoming
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50 mb-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date</p>
                      <p className="text-sm font-semibold text-gray-700">{appointment.slotDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Time</p>
                      <p className="text-sm font-semibold text-gray-700 text-right">{appointment.slotTime}</p>
                    </div>
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => openModal(appointment)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Prescribe & Admit
                    </button>
                  )}

                  {isCompleted && (
                    <div className="w-full py-2.5 bg-gray-50 text-gray-400 text-sm font-medium rounded-xl text-center cursor-not-allowed">
                      Consultation Completed
                    </div>
                  )}
                </div>
              );
            })}

            {activeAppointments.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Appointments</h3>
                <p className="text-gray-500 max-w-xs mt-1">You don't have any upcoming appointments scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ===================== MODAL ===================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeModal}>
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl transform transition-all scale-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white text-lg font-bold">Consultation Details</h2>
              <button onClick={closeModal} className="text-white/80 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">

              {/* Patient Summary */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {selectedAppointment?.userData.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedAppointment?.userData.name}</p>
                  <p className="text-xs text-gray-500">Phone: {selectedAppointment?.userData.phone}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Diagnosis / Disease</label>
                  <input
                    type="text"
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="e.g. Viral Fever, Acute Migraine"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Prescription</label>
                  <textarea
                    rows="4"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                    placeholder="List medicines, dosage, and instructions..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Hospital Admission Required?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`cursor-pointer border-2 rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${bedNeeded === 'yes' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                      <input type="radio" name="bedNeeded" value="Yes" checked={bedNeeded === 'Yes'} onChange={(e) => setBedNeeded(e.target.value)} className="hidden" />
                      <span className="font-bold">Yes, Admit</span>
                    </label>
                    <label className={`cursor-pointer border-2 rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${bedNeeded === 'no' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                      <input type="radio" name="bedNeeded" value="No" checked={bedNeeded === 'No'} onChange={(e) => setBedNeeded(e.target.value)} className="hidden" />
                      <span className="font-bold">No, Outpatient</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!disease || !prescription || !bedNeeded}
                className="mt-8 w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Complete Consultation
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
