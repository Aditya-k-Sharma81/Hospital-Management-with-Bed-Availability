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
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Bed Receipts</p>
            <div className='flex flex-col gap-4 sm:grid sm:grid-cols-[1fr_2fr] gap-4 py-2 border-b'> {/* Header Row if needed, or just list items */}
                {/* Using a card layout for receipts */}
            </div>

            <div className='flex flex-col gap-4 mt-4'>
                {receipts.map((item, index) => {
                    const isExpired = new Date() > new Date(item.dischargeDate);
                    return (
                        <div key={index} className='border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2 relative'>
                            {/* Header Row: Patient Name + Delete Button */}
                            <div className="flex justify-between items-start">
                                <h2 className='text-lg font-semibold text-[#5f6FFF]'>Patient: {item.patientName}</h2>
                                {isExpired && (
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 border border-red-200 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                                        title="Remove Expired Receipt"
                                    >
                                        <span>Remove</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className='text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                <p><strong>Age:</strong> {item.age}</p>
                                <p><strong>Disease:</strong> {item.disease}</p>
                                <p><strong>Doctor:</strong> {item.doctorName}</p>
                                <p><strong>Bed Number:</strong> {item.bedNumber} ({item.wardType})</p>
                                <p><strong>Allocated On:</strong> {new Date(item.allocationDate).toLocaleString()}</p>
                                <p><strong>Discharge On:</strong> {new Date(item.dischargeDate).toLocaleString()}</p>
                            </div>
                        </div>
                    );
                })}
                {receipts.length === 0 && <p className="text-gray-500">No receipts found.</p>}
            </div>
        </div>
    );
};

export default Receipt;
