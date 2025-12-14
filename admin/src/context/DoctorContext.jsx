// import { createContext, useState } from "react";

// export const DoctorContext = createContext();

// const DoctorContextProvider = (props) => {

//     const [dToken, setDToken] = useState(
//         localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
//     );

//     const [role, setRole] = useState(
//         localStorage.getItem("role") ? localStorage.getItem("role") : ""
//     );

//     const backendUrl = import.meta.env.VITE_BACKEND_URL;

//     const value = {
//         dToken, setDToken,
//         role, setRole,
//         backendUrl
//     };

//     return (
//         <DoctorContext.Provider value={value}>
//             {props.children}
//         </DoctorContext.Provider>
//     );
// };

// export default DoctorContextProvider;


import axios from "axios";
import { createContext, useState } from "react";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [drole, setDRole] = useState(localStorage.getItem("drole") || "");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getDoctorAppointment = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/doctor-appointment",
        {
          headers: {
            token: dToken,   
          },
        }
      );

      return data;

    } catch (error) {
      console.error(error);
    }
  };


  

  const value = {
    dToken,
    setDToken,
    drole,
    setDRole,
    backendUrl,
    getDoctorAppointment
  };

  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorContextProvider;
