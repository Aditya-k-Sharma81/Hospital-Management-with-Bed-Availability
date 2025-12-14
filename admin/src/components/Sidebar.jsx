// import React, { useContext } from 'react'
// import { AdminContext } from '../context/AdminContext'
// import { NavLink } from 'react-router-dom';
// import { assets } from '../assets/assets_admin/assets';
// import {DoctorContext} from '../context/DoctorContext';

// export default function Sidebar() 
// {
//     const {aToken} = useContext(AdminContext);
//   return (
//     <div className='min-h-screen border-white border-r bg-[#F8F9FD]'>
//       {
//         aToken && <ul className='text-[#515151] mt-5'>
//             <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]':''}`} to={'/admin-dashboard'}>
//                 <img src={assets.home_icon}/>
//                 <p>Dashboard</p>
//             </NavLink>

//             <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]':''}`} to={'/all-appointments'}>
//                 <img src={assets.appointment_icon}/>
//                 <p>Appointment</p>
//             </NavLink>

//             <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]':''}`} to={'/add-doctor'}>
//                 <img src={assets.add_icon}/>
//                 <p>Add Doctor</p>
//             </NavLink>

//             <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]':''}`} to={'/doctor-list'}>
//                 <img src={assets.people_icon}/>
//                 <p>Doctor List</p>
//             </NavLink>

//             <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]':''}`} to={'/add-bed'}>
//                 <img className='w-10 h-10' src={'https://img.icons8.com/external-others-pike-picture/1200/external-clinic-plastic-surgery-clinic-others-pike-picture-18.jpg'}></img>
//                 <p>Add Bed</p>
//             </NavLink>

//         </ul>
//       }
//     </div>
//   )
// }



import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_admin/assets";
import { StaffContext } from "../context/StaffContext";

export default function Sidebar() {
  const { aToken, arole } = useContext(AdminContext);
  const { dToken, drole } = useContext(DoctorContext);
  const { sToken, srole } = useContext(StaffContext);


  return (
    <div className="min-h-screen border-white border-r bg-[#F8F9FD]">
      {arole === "admin" && aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5F6FFF]" : ""
              }`
            }
            to={"/admin-dashboard"}
          >
            <img src={assets.home_icon} />
            <p>Dashboard</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5F6FFF]" : ""
              }`
            }
            to={"/all-appointments"}
          >
            <img src={assets.appointment_icon} />
            <p>Appointment</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5F6FFF]" : ""
              }`
            }
            to={"/add-doctor"}
          >
            <img src={assets.add_icon} />
            <p>Add Doctor</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5F6FFF]" : ""
              }`
            }
            to={"/doctor-list"}
          >
            <img src={assets.people_icon} />
            <p>Doctor List</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5F6FFF]" : ""
              }`
            }
            to={"/add-bed"}
          >
            <img
              className="w-10 h-10"
              src="https://img.icons8.com/external-others-pike-picture/1200/external-clinic-plastic-surgery-clinic-others-pike-picture-18.jpg"
            />
            <p>Add Bed</p>
          </NavLink>
        </ul>
      )}

      {/* Doctor Sidebar */}
      {drole === "doctor" && dToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5F6FFF]" : ""
              }`
            }
            to={"/doctor-dashboard"}
          >
            <img src={assets.home_icon} />
            <p>Dashboard</p>
          </NavLink>
        </ul>
      )}

      {srole === "staff" && sToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5F6FFF]" : ""
              }`
            }
            to={"/staff-dashboard"}
          >
            <img src={assets.home_icon} />
            <p>Dashboard</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-[#5F6FFF]" : ""
              }`
            }
            to={"/staff-bed-availability"}
          >
            {/* Re-using a generic icon or asset for now, or use add_icon/home_icon if no bed icon */}
            <img src={assets.appointment_icon} />
            <p>Bed Status</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
}
