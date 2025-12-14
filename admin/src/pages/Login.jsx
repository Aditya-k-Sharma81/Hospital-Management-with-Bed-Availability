// import React, { useContext, useState } from "react";
// import { AdminContext } from "../context/AdminContext";
// import { DoctorContext } from "../context/DoctorContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Login = () => {
//   const { setAToken, backendUrl, setARole } = useContext(AdminContext);
//   const { setDToken, setDRole } = useContext(DoctorContext);

//   const [state, setState] = useState("Admin");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     console.log(state);

//     try {
//       if (state === "Admin") 
//       {
//         const { data } = await axios.post(backendUrl + "/api/admin/login", { email, password });

//         if (data.success) 
//         {
//           localStorage.setItem("aToken", data.token);
//           localStorage.setItem("arole", "admin");

//           setAToken(data.token);
//           setARole("admin");
//         } else toast.error(data.message);
//       } 
//       else 
//       {
//         const { data } = await axios.post(backendUrl + "/api/doctor/login", { email, password });

//         if (data.success) 
//         {
//           localStorage.setItem("dToken", data.token);
//           localStorage.setItem("drole", "doctor");

//           setDToken(data.token);
//           setDRole("doctor");
//         } else toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Login failed");
//     }
//   };

//   return (
//     <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
//       <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
//         <p className="text-2xl font-semibold m-auto">
//           <span className="text-[#5F6FFF]">{state} </span>Login
//         </p>

//         <div className="w-full">
//           <p>Email</p>
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border border-[#DADADA] rounded w-full p-2 mt-1"
//             type="email"
//             required
//           />
//         </div>

//         <div className="w-full">
//           <p>Password</p>
//           <input
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border border-[#DADADA] rounded w-full p-2 mt-1"
//             type="password"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base cursor-pointer hover:bg-gray-700 hover:text-white"
//         >
//           Login
//         </button>

//         {state === "Admin" ? (
//           <p>
//             Doctor Login?{" "}
//             <span className="text-[#5F6FFF] underline cursor-pointer" onClick={() => setState("Doctor")}>
//               Click here
//             </span>
//           </p>
//         ) : (
//           <p>
//             Admin Login?{" "}
//             <span className="text-[#5F6FFF] underline cursor-pointer" onClick={() => setState("Admin")}>
//               Click here
//             </span>
//           </p>
//         )}
//       </div>
//     </form>
//   );
// };

// export default Login;







import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { StaffContext } from "../context/StaffContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { setAToken, backendUrl, setARole } = useContext(AdminContext);
  const { setDToken, setDRole } = useContext(DoctorContext);
  const { setSToken, setSRole } = useContext(StaffContext);

  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // ADMIN LOGIN
      if (state === "Admin") {
        const { data } = await axios.post(
          backendUrl + "/api/admin/login",
          { email, password }
        );

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          localStorage.setItem("arole", "admin");
          setAToken(data.token);
          setARole("admin");
        } else toast.error(data.message);
      }

      // DOCTOR LOGIN
      else if (state === "Doctor") {
        const { data } = await axios.post(
          backendUrl + "/api/doctor/login",
          { email, password }
        );

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          localStorage.setItem("drole", "doctor");
          setDToken(data.token);
          setDRole("doctor");
        } else toast.error(data.message);
      }

      // STAFF LOGIN
      else {
        
        const { data } = await axios.post(
          backendUrl + "/api/staff/staff-login",
          { email, password }
        );

        if (data.success) {
          localStorage.setItem("sToken", data.token);
          localStorage.setItem("srole", "staff");
          setSToken(data.token);
          setSRole("staff");
        } else toast.error(data.message);
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-[#5F6FFF]">{state} </span>Login
        </p>

        {/* Email */}
        <div className="w-full">
          <p>Email</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <p>Password</p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base hover:bg-gray-700"
        >
          Login
        </button>

        {/* SWITCH LOGIN LINKS */}
        <div className="flex flex-col gap-1 text-center w-full">
          {state !== "Admin" && (
            <p>
              Admin Login?{" "}
              <span
                className="text-[#5F6FFF] underline cursor-pointer"
                onClick={() => setState("Admin")}
              >
                Click here
              </span>
            </p>
          )}

          {state !== "Doctor" && (
            <p>
              Doctor Login?{" "}
              <span
                className="text-[#5F6FFF] underline cursor-pointer"
                onClick={() => setState("Doctor")}
              >
                Click here
              </span>
            </p>
          )}

          {state !== "Staff" && (
            <p>
              Staff Login?{" "}
              <span
                className="text-[#5F6FFF] underline cursor-pointer"
                onClick={() => setState("Staff")}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
