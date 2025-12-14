import React, { useContext, useEffect } from "react";
import { StaffContext } from "../../context/StaffContext";

const BedAvailability = () => {
    const { sToken, beds, getAllBeds } = useContext(StaffContext);

    useEffect(() => {
        if (sToken) {
            getAllBeds();
        }
    }, [sToken]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen w-full">
            <div className="bg-white p-6 rounded-xl shadow mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Bed Availability Status</h1>
                <p className="text-gray-500 mt-2">
                    Visual representation of hospital beds. <span className="text-green-600 font-bold">Green = Available</span>, <span className="text-red-500 font-bold">Red = Occupied</span>.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {beds.map((bed) => (
                    <div
                        key={bed._id}
                        className={`p-6 rounded-xl shadow-lg border-2 transform transition hover:scale-105 ${bed.status === "available"
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span
                                className={`text-xs font-bold px-2 py-1 rounded uppercase ${bed.status === "available"
                                    ? "bg-green-200 text-green-800"
                                    : "bg-red-200 text-red-800"
                                    }`}
                            >
                                {bed.status}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                                {bed.wardType}
                            </span>
                        </div>

                        <h3 className="text-3xl font-bold text-gray-800 mb-2">
                            {bed.bedNumber}
                        </h3>

                        {bed.status === "occupied" && (
                            <div className="mt-4 pt-4 border-t border-red-100">
                                <p className="text-xs text-gray-500 uppercase">Patient</p>
                                <p className="font-semibold text-gray-800 truncate">
                                    {bed.patientName || "Unknown"}
                                </p>
                                {bed.dischargeDate && (
                                    <div className="mt-2 text-xs text-red-600 font-medium">
                                        Discharge: {new Date(bed.dischargeDate).toLocaleDateString()} {new Date(bed.dischargeDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                        )}

                        {bed.status === "available" && (
                            <div className="mt-4 pt-4 border-t border-green-100">
                                <p className="text-sm text-green-700 font-medium">Ready for Allocation</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BedAvailability;
