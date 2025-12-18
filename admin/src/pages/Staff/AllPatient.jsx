import React, { useContext, useEffect, useState } from "react";
import { StaffContext } from "../../context/StaffContext";
import { assets } from "../../assets/assets_admin/assets";

const AllPatient = () => {
    const { sToken, bedReceipts, getAllBedReceipts, dischargePatient } = useContext(StaffContext);
    const [searchTerm, setSearchTerm] = useState("");

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDischargeClick = (receipt) => {
        setSelectedReceipt(receipt);
        setShowConfirmModal(true);
    };

    const confirmDischarge = async () => {
        if (selectedReceipt) {
            setLoading(true);
            const success = await dischargePatient(selectedReceipt.bedId, selectedReceipt._id);
            setLoading(false);
            if (success) {
                setShowConfirmModal(false);
                setSelectedReceipt(null);
            }
        }
    };

    const cancelDischarge = () => {
        setShowConfirmModal(false);
        setSelectedReceipt(null);
    };

    useEffect(() => {
        if (sToken) {
            getAllBedReceipts();
        }
    }, [sToken]);

    const filteredReceipts = bedReceipts.filter((receipt) =>
        (receipt.patientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (receipt.bedNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (receipt.doctorName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 w-full font-sans pb-10 relative">
            {/* Decorative Background */}
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/80 to-transparent -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 pt-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="h-8 w-1 bg-blue-600 rounded-full"></span>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All Bed Receipts</h1>
                        </div>
                        <p className="text-gray-500 font-medium ml-4">
                            History of all {bedReceipts.length} bed allocations.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative group w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search patients, doctors..."
                            className="pl-11 pr-4 py-3.5 w-full bg-white border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg transition-all duration-300 placeholder-gray-400 text-gray-700 hover:ring-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Receipts List */}
                <div className="h-[calc(100vh-250px)] overflow-y-auto pr-2 pb-20">
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredReceipts.map((receipt) => {
                            const isDischarged = new Date(receipt.dischargeDate) < new Date();
                            const statusColor = isDischarged ? "bg-gray-100 text-gray-500 border-gray-200" : "bg-emerald-50 text-emerald-600 border-emerald-100";
                            const statusDot = isDischarged ? "bg-gray-400" : "bg-emerald-500 animate-pulse";

                            return (
                                <li key={receipt._id} className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                                    {/* Decorative Gradient Top Bar */}
                                    <div className={`absolute top-0 left-0 w-full h-1.5 ${isDischarged ? 'bg-gray-200' : 'bg-gradient-to-r from-blue-500 to-emerald-400'}`}></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                                                {receipt.patientName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg leading-tight">{receipt.patientName}</h3>
                                                <p className="text-xs text-gray-500">Age: {receipt.age || "N/A"}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusColor}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                                            {isDischarged ? "Discharged" : "Admitted"}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-gray-400">Bed</span>
                                                <span className="font-bold text-gray-800 text-sm">{receipt.bedNumber}</span>
                                            </div>
                                            <div className="h-8 w-px bg-gray-200 mx-2"></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-gray-400">Ward</span>
                                                <span className="font-bold text-gray-800 text-sm capitalize">{receipt.wardType}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                            <div>
                                                <span className="block font-medium text-gray-900">{receipt.disease}</span>
                                                <span className="text-xs text-gray-500">Dr. {receipt.doctorName}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div className="flex flex-col text-xs">
                                                <span className="text-gray-500">Admitted: <span className="text-gray-900 font-medium">{new Date(receipt.allocationDate).toLocaleDateString()}</span></span>
                                                <span className="text-gray-500">Discharge: <span className="text-gray-900 font-medium">{new Date(receipt.dischargeDate).toLocaleDateString()}</span></span>
                                            </div>
                                        </div>

                                        {!isDischarged && (
                                            <button
                                                onClick={() => handleDischargeClick(receipt)}
                                                className="w-full mt-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Discharge Patient
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {filteredReceipts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 opacity-60">
                            <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-lg font-medium text-gray-900">No receipts found</p>
                            <p className="text-sm text-gray-500">Try adjusting your search terms.</p>
                        </div>
                    )}
                </div>

                {/* Custom Confirmation Modal */}
                {showConfirmModal && selectedReceipt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100 animate-fadeIn">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Discharge</h3>
                                <p className="text-gray-500 mb-6">
                                    Are you sure you want to discharge <span className="font-bold text-gray-800">{selectedReceipt.patientName}</span> from <span className="font-bold text-gray-800">Bed {selectedReceipt.bedNumber}</span> early? This action cannot be undone.
                                </p>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={cancelDischarge}
                                        disabled={loading}
                                        className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDischarge}
                                        disabled={loading}
                                        className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            "Yes, Discharge"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllPatient;




















// import React, { useContext, useEffect, useState } from "react";
// import { StaffContext } from "../../context/StaffContext";
// import { assets } from "../../assets/assets_admin/assets";

// const AllPatient = () => {
//     const { sToken, bedReceipts, getAllBedReceipts } = useContext(StaffContext);
//     const [searchTerm, setSearchTerm] = useState("");

//     useEffect(() => {
//         if (sToken) {
//             getAllBedReceipts();
//         }
//     }, [sToken]);

//     const filteredReceipts = bedReceipts.filter((receipt) =>
//         (receipt.patientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (receipt.bedNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (receipt.doctorName || "").toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="min-h-screen bg-gray-50/50 w-full font-sans pb-10">
//             {/* Decorative Background */}
//             <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/80 to-transparent -z-10 pointer-events-none" />

//             <div className="max-w-7xl mx-auto px-6 pt-8">
//                 {/* Header */}
//                 <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
//                     <div>
//                         <div className="flex items-center gap-3 mb-2">
//                             <span className="h-8 w-1 bg-blue-600 rounded-full"></span>
//                             <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All Bed Receipts</h1>
//                         </div>
//                         <p className="text-gray-500 font-medium ml-4">
//                             History of all {bedReceipts.length} bed allocations.
//                         </p>
//                     </div>

//                     {/* Search */}
//                     <div className="relative group w-full md:w-96">
//                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                             <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                             </svg>
//                         </div>
//                         <input
//                             type="text"
//                             placeholder="Search patients, doctors..."
//                             className="pl-11 pr-4 py-3.5 w-full bg-white border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg transition-all duration-300 placeholder-gray-400 text-gray-700 hover:ring-gray-300"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 {/* Receipts List */}
//                 <div className="h-[calc(100vh-250px)] overflow-y-auto pr-2">
//                     <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {filteredReceipts.map((receipt) => {
//                             const isDischarged = new Date(receipt.dischargeDate) < new Date();
//                             const statusColor = isDischarged ? "bg-gray-100 text-gray-500 border-gray-200" : "bg-emerald-50 text-emerald-600 border-emerald-100";
//                             const statusDot = isDischarged ? "bg-gray-400" : "bg-emerald-500 animate-pulse";

//                             return (
//                                 <li key={receipt._id} className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
//                                     {/* Decorative Gradient Top Bar */}
//                                     <div className={`absolute top-0 left-0 w-full h-1.5 ${isDischarged ? 'bg-gray-200' : 'bg-gradient-to-r from-blue-500 to-emerald-400'}`}></div>

//                                     <div className="flex justify-between items-start mb-4">
//                                         <div className="flex items-center gap-3">
//                                             <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
//                                                 {receipt.patientName.charAt(0)}
//                                             </div>
//                                             <div>
//                                                 <h3 className="font-bold text-gray-900 text-lg leading-tight">{receipt.patientName}</h3>
//                                                 <p className="text-xs text-gray-500">Age: {receipt.age || "N/A"}</p>
//                                             </div>
//                                         </div>
//                                         <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusColor}`}>
//                                             <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
//                                             {isDischarged ? "Discharged" : "Admitted"}
//                                         </span>
//                                     </div>

//                                     <div className="space-y-3 mb-6">
//                                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
//                                             <div className="flex flex-col">
//                                                 <span className="text-[10px] uppercase font-bold text-gray-400">Bed</span>
//                                                 <span className="font-bold text-gray-800 text-sm">{receipt.bedNumber}</span>
//                                             </div>
//                                             <div className="h-8 w-px bg-gray-200 mx-2"></div>
//                                             <div className="flex flex-col">
//                                                 <span className="text-[10px] uppercase font-bold text-gray-400">Ward</span>
//                                                 <span className="font-bold text-gray-800 text-sm capitalize">{receipt.wardType}</span>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-start gap-2 text-sm text-gray-600">
//                                             <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
//                                             </svg>
//                                             <div>
//                                                 <span className="block font-medium text-gray-900">{receipt.disease}</span>
//                                                 <span className="text-xs text-gray-500">Dr. {receipt.doctorName}</span>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-start gap-2 text-sm text-gray-600">
//                                             <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                             </svg>
//                                             <div className="flex flex-col text-xs">
//                                                 <span className="text-gray-500">Admitted: <span className="text-gray-900 font-medium">{new Date(receipt.allocationDate).toLocaleDateString()}</span></span>
//                                                 <span className="text-gray-500">Discharge: <span className="text-gray-900 font-medium">{new Date(receipt.dischargeDate).toLocaleDateString()}</span></span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </li>
//                             );
//                         })}
//                     </ul>

//                     {filteredReceipts.length === 0 && (
//                         <div className="flex flex-col items-center justify-center py-20 opacity-60">
//                             <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                             </svg>
//                             <p className="text-lg font-medium text-gray-900">No receipts found</p>
//                             <p className="text-sm text-gray-500">Try adjusting your search terms.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AllPatient;
