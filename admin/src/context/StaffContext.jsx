import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const StaffContext = createContext();

const StaffContextProvider = ({ children }) => {
  const [sToken, setSToken] = useState(localStorage.getItem("sToken") || "");
  const [srole, setSRole] = useState(localStorage.getItem("srole") || "");
  const [beds, setBeds] = useState([]);
  const [users, setUsers] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Socket.io initialization
  useEffect(() => {
    if (sToken) {
      const socket = io(backendUrl);

      socket.on("connect", () => {
        console.log("Connected to WebSocket");
      });

      socket.on("bedUpdate", () => {
        // console.log("Bed Update Received");
        getAllBeds();
        getAllUsers();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [sToken, backendUrl]);

  const getAllBeds = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/staff/get-all-beds");
      if (data.success) {
        setBeds(data.beds);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/staff/get-all-users");
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const allocateBed = async (bedId, userId, dischargeDate, disease, doctorName) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/staff/allocate-bed", {
        bedId,
        userId,
        dischargeDate,
        disease,
        doctorName
      });
      if (data.success) {
        toast.success(data.message);
        getAllBeds(); // Refresh beds to show updated status
      } else {
        toast.error(data.message);
      }
      return data.success;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const value = {
    sToken,
    setSToken,
    srole,
    setSRole,
    backendUrl,
    beds,
    users,
    getAllBeds,
    getAllUsers,
    allocateBed,
  };

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  );
};

export default StaffContextProvider;
