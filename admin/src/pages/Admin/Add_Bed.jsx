import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function Add_Bed() {
  const { backendUrl } = useContext(AdminContext);

  const [bedNumber, setBedNumber] = useState("");
  const [wardType, setWardType] = useState("");
  const [status, setStatus] = useState("available");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const bedData = {
      bedNumber,
      wardType,
      status
    };

    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/add-bed",
        bedData
      );

      if (data.success) {
        toast.success("Bed Added Successfully");

        // Reset fields
        setBedNumber("");
        setWardType("");
        setStatus("available");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Bed</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-3xl text-gray-600">

        {/* BED NUMBER */}
        <div className="flex flex-col gap-1 mb-5">
          <p>Bed Number</p>
          <input
            type="text"
            value={bedNumber}
            onChange={(e) => setBedNumber(e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="G-01 / ICU-02"
            required
          />
        </div>

        {/* WARD TYPE */}
        <div className="flex flex-col gap-1 mb-5">
          <p>Ward Type</p>
          <select
            value={wardType}
            onChange={(e) => setWardType(e.target.value)}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Ward</option>
            <option value="General">General</option>
            <option value="ICU">ICU</option>
          </select>
        </div>

        {/* STATUS */}
        <div className="flex flex-col gap-1 mb-5">
          <p>Status</p>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-10 py-3 mt-4 bg-[#5F6FFF] text-white rounded-full cursor-pointer"
        >
          Add Bed
        </button>
      </div>
    </form>
  );
} 