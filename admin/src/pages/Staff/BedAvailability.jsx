import React, { useContext, useEffect, useState } from "react";
import { StaffContext } from "../../context/StaffContext";

const BedAvailability = () => {
    const { sToken, beds, getAllBeds } = useContext(StaffContext);
    const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0 });

    useEffect(() => {
        if (sToken) {
            getAllBeds();
        }
    }, [sToken]);

    useEffect(() => {
        if (beds) {
            const total = beds.length;
            const available = beds.filter(bed => bed.status === 'available').length;
            const occupied = beds.filter(bed => bed.status === 'occupied').length;
            setStats({ total, available, occupied });
        }
    }, [beds]);

    return (
        <div className="p-8 bg-gray-50 min-h-screen w-full font-sans">
            {/* Header & Stats Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bed Availability</h1>
                    <p className="text-gray-500 mt-1">Real-time status of hospital ward capacities</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[160px]">
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>

                    <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[160px]">
                        <div className="p-3 rounded-xl bg-green-50 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Available</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
                        </div>
                    </div>

                    <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[160px]">
                        <div className="p-3 rounded-xl bg-red-50 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Occupied</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.occupied}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Beds Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {beds.map((bed) => (
                    <div
                        key={bed._id}
                        className={`relative group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border top-0
                            ${bed.status === "available"
                                ? "bg-white border-green-100 shadow-green-100/50"
                                : "bg-white border-red-100 shadow-red-100/50"
                            } shadow-md`}
                    >
                        {/* Status Stripe */}
                        <div className={`h-2 w-full absolute top-0 left-0 
                            ${bed.status === "available" ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gradient-to-r from-red-400 to-red-500"}`}>
                        </div>

                        <div className="p-5 pt-7">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {bed.wardType}
                                </span>
                                <span
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide
                                        ${bed.status === "available"
                                            ? "bg-green-50 text-green-600 border border-green-100"
                                            : "bg-red-50 text-red-600 border border-red-100"
                                        }`}
                                >
                                    {bed.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                                    {bed.bedNumber}
                                </h3>
                                <div className={`p-2 rounded-full ${bed.status === 'available' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                    </svg>
                                </div>
                            </div>

                            {bed.status === "occupied" ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="bg-white p-1.5 rounded-full shadow-sm text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-semibold">Patient</p>
                                            <p className="text-sm font-bold text-gray-800 truncate max-w-[120px]">
                                                {bed.patientName || "Unknown"}
                                            </p>
                                        </div>
                                    </div>

                                    {bed.dischargeDate && (
                                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                            <div className="bg-white p-1.5 rounded-full shadow-sm text-red-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75l4 1a.75.75 0 0 0 .36-1.453L10.75 9.25V5Z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-red-500 uppercase font-semibold">Discharge</p>
                                                <p className="text-xs font-bold text-red-700">
                                                    {new Date(bed.dischargeDate).toLocaleDateString()}
                                                    <span className="block text-[10px] font-medium opacity-80">
                                                        {new Date(bed.dischargeDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                                    <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-bold">Ready for Allocation</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BedAvailability;

