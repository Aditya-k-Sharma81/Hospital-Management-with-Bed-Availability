import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Receipt = () => {
    const { backendUrl, token } = useContext(AppContext);
    const [receipts, setReceipts] = useState([]);

    const getReceipts = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/bed-receipts', { headers: { token } });
            if (data.success) {
                setReceipts(data.receipts.reverse()); // Show latest first
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            getReceipts();
        }
    }, [token]);

    const handleDelete = async (receiptId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/delete-bed-receipt', { receiptId }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                getReceipts(); // Refresh list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-10">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">My Bed Receipts</h1>
                    <p className="text-gray-500 mt-2">Manage and view your bed allocation history</p>
                </header>

                {receipts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No bed receipts found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {receipts.map((item, index) => {
                            const isExpired = new Date() > new Date(item.dischargeDate);
                            return (
                                <div key={index} className="relative group perspective-1000">
                                    {/* Receipt Card */}
                                    <div className="bg-white p-0 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-sm relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] border-t-[6px] border-indigo-500">

                                        {/* Optional: Serrated top edge decoration (CSS trick or simplified with border) */}
                                        {/* For clean modern look, we stick to the top colored border.
                                            We can add a 'hole punch' look if desired, but let's keep it clean first. */}

                                        <div className="p-6 pb-4">
                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Receipt</h2>
                                                    <p className="font-mono text-xs text-gray-400">#{item._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Patient Info */}
                                            <div className="text-center mb-6">
                                                <h3 className="text-xl font-bold text-gray-800 mb-1">{item.patientName}</h3>
                                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                    {item.age} Years • {item.gender || 'Patient'}
                                                </span>
                                            </div>

                                            {/* Details Table */}
                                            <div className="border-t border-dashed border-gray-200 py-4 space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">Doctor</span>
                                                    <span className="font-medium text-gray-800">{item.doctorName}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">Department</span>
                                                    <span className="font-medium text-gray-800">{item.department || 'General'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">Disease</span>
                                                    <span className="font-medium text-gray-800">{item.disease}</span>
                                                </div>
                                            </div>

                                            <div className="border-t border-dashed border-gray-200 py-4 space-y-3 bg-gray-50/50 -mx-6 px-6">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">Bed No.</span>
                                                    <span className="font-bold text-indigo-600">{item.bedNumber} <span className="text-gray-400 font-normal">({item.wardType})</span></span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">Allocated</span>
                                                    <span className="font-medium text-gray-800">{new Date(item.allocationDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">Discharge</span>
                                                    <span className={`font-medium ${isExpired ? 'text-red-500' : 'text-green-600'}`}>
                                                        {new Date(item.dischargeDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer / Barcode */}
                                        <div className="bg-gray-50 p-4 border-t border-gray-100 flex flex-col items-center justify-center gap-2">
                                            {/* Fake Barcode */}
                                            <div className="w-full h-8 flex justify-between items-end px-4 opacity-40">
                                                {[...Array(20)].map((_, i) => (
                                                    <div key={i} className={`w-[2px] bg-black h-${Math.random() > 0.5 ? 'full' : '2/3'}`}></div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Authorized Signature</p>
                                        </div>

                                        {/* Expired Action Overlay (Optional) or Button */}
                                        {isExpired && (
                                            <div className="absolute top-2 right-2">
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove Expired Receipt"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        {isExpired && (
                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-red-400 opacity-50"></div>
                                        )}
                                    </div>

                                    {/* Paper Fold Effect (Bottom Shadow) */}
                                    <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gray-800/5 blur-md rounded-[100%] z-[-1]"></div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Receipt;
