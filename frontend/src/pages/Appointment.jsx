// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets_frontend } from "../assets/assets_frontend/assets";
// import ReleatedDoctors from "../components/ReleatedDoctors";
// import { toast } from "react-toastify";

// const Appointment = () => {
//   const navigate = useNavigate();
//   const { docId } = useParams();
//   const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
//   const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

//   const [docInfo, setDocInfo] = useState(null);
//   const [docSlots, setDocSlots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState('');
 
//   const fetchDocInfo = () => {
//     const info = doctors.find(doc => doc._id === docId);
//     setDocInfo(info);
//   };

//   const getAvailableSlots = () => {
//     setDocSlots([]);

//     let today = new Date();

//     for (let i = 0; i < 7; i++) {
//       let currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);

//       let endTime = new Date(currentDate);
//       endTime.setHours(21, 0, 0, 0);

//       if (i === 0) {
//         let now = new Date();
//         let hour = now.getHours() + 1;
//         currentDate.setHours(hour < 10 ? 10 : hour);
//         currentDate.setMinutes(now.getMinutes() > 30 ? 30 : 0);
//       } else {
//         currentDate.setHours(10);
//         currentDate.setMinutes(0);
//       }

//       let timeSlots = [];

//       while (currentDate < endTime) {
//         let formatted = currentDate.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit"
//         });

//         timeSlots.push({
//           datetime: new Date(currentDate),
//           time: formatted
//         });

//         currentDate.setMinutes(currentDate.getMinutes() + 30);
//       }

//       setDocSlots(prev => [...prev, timeSlots]);
//     }
//   };

//   const bookAppointment = async() => {
//     if(!token)
//     {
//       toast.warn("Login to book appointment");
//       navigate("/login");
//       return;
//     }

//     try
//     {
//       const data = docSlots[slotIndex][0].datetime;
//       let day = data.getDate();
//       let month = data.getMonth()+1;

//       let year = data.getFullYear();

//       const slotDate = day + "_" + month + "_" + year;
//       console.log(slotDate);
//     }catch(error)
//     {

//     }
//   }

//   useEffect(() => {
//     fetchDocInfo();
//   }, [doctors, docId]);

//   useEffect(() => {
//     if (docInfo) {
//       getAvailableSlots();
//     }
//   }, [docInfo]);

//   useEffect(() => {
//     console.log(docSlots);
//   }, [docSlots]);

//   return (
//     docInfo && (
//       <div>
//         {/* ---------------- Doctor Details ------------- */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div>
//             <img className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg" src={docInfo.image} />
//           </div>

//           <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
//             <p className="flex items-center gap-2 text-2xl font-medium">
//               {docInfo.name}
//               <img className="w-5" src={assets_frontend.verified_icon} />
//             </p>

//             <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
//               <p>{docInfo.degree} - {docInfo.speciality}</p>
//               <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
//             </div>

//             <div>
//               <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
//                 About <img src={assets_frontend.info_icon} />
//               </p>
//               <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
//             </div>

//             <p className="text-gray-500 font-medium mt-4">
//               Appointment fee:
//               <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
//             </p>
//           </div>
//         </div>

//         {/* ---------------- Booking Slots ---------------- */}
//         <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
//           <p>Booking Slots</p>

//           {/* --------- Days --------- */}
//           <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
//             {docSlots
//               .filter(day => day.length > 0) 
//               .map((item, index) => {
//                 const firstSlot = item[0];
              
//                 return (
//                   <div
//                     onClick={() => setSlotIndex(index)}
//                     className={`text-center py-6 min-w-16 rounded-full cursor-pointer 
//                     ${slotIndex === index ? "bg-[#5f6FFF] text-white" : "border border-gray-200"}`}
//                     key={index}
//                   >
//                     <p>{daysOfWeek[firstSlot.datetime.getDay()]}</p>
//                     <p>{firstSlot.datetime.getDate()}</p>
//                   </div>
//                 );
//               })}
//           </div>


//           {/* --------- Time Slots --------- */}
//           <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
//             {docSlots.filter(day => day.length > 0)[slotIndex]?.length > 0 ? (
//               docSlots
//                 .filter(day => day.length > 0)[slotIndex]
//                 .map((item, index) => (
//                   <p
//                     onClick={() => setSlotTime(item.time)}
//                     className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer 
//                     ${item.time === slotTime ? "bg-[#5f6FFF] text-white" : "text-gray-400 border border-gray-300"}`}
//                     key={index}
//                   >
//                     {item.time.toLowerCase()}
//                   </p>
//                 ))
//             ) : (
//               <p className="text-gray-400">No slots available</p>
//             )}
//           </div>


//           <button onClick={bookAppointment} className="bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6">
//             Book an appointment
//           </button>
//         </div>
//         {/* -------------- Listing Related Soctors ---------------- */}
//         <ReleatedDoctors docId={docId} speciality={docInfo.speciality} />
//       </div>
//     )
//   );
// };

// export default Appointment;



import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets_frontend } from "../assets/assets_frontend/assets";
import ReleatedDoctors from "../components/ReleatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
const Appointment = () => {
  const navigate = useNavigate();
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = () => {
    const info = doctors.find((doc) => doc._id === docId);
    setDocInfo(info);
  };

  // FIXED SLOT GENERATION (clean days)
  const getAvailableSlots = () => {
    setDocSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i,
        0,
        0,
        0,
        0
      );

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        let now = new Date();
        let hour = now.getHours() + 1;

        currentDate.setHours(hour < 10 ? 10 : hour);
        currentDate.setMinutes(now.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) 
      {
        let formatted = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formatted;

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

        if(isSlotAvailable)
        {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formatted,
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  // FIXED: NO FILTER IN INDEX SELECTION

  const bookAppointment = async () => {
  if (!token) {
    toast.warn("Login to book appointment");
    navigate("/login");
    return;
  }

  try {
    const selectedSlot = docSlots[slotIndex][0]; 
    const date = selectedSlot.datetime;

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const slotDate = `${day}_${month}_${year}`;
    const slotTime = selectedSlot.time;  // <-- IMPORTANT

    const { data } = await axios.post(
      backendUrl + "/api/user/book-appointment",
      { docId, slotDate, slotTime },
      { headers: { token } }
    );

    if (data.success) {
      toast.success(data.message);
      getDoctorsData();
      navigate("/my-appointments");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return (
    docInfo && (
      <div>
        {/* ---------------- Doctor Details ------------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium">
              {docInfo.name}
              <img className="w-5" src={assets_frontend.verified_icon} />
            </p>

            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets_frontend.info_icon} />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>

            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fee}
              </span>
            </p>
          </div>
        </div>

        {/* ---------------- Booking Slots ---------------- */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>

          {/* --------- Days --------- */}
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.map((day, index) => {
              // EMPTY DAY UI (but keep index correct)
              if (day.length === 0) {
                return (
                  <div
                    key={index}
                    className="text-center py-6 min-w-16 rounded-full border border-gray-200 text-gray-300"
                  >
                    
                  </div>
                );
              }

              const firstSlot = day[0];

              return (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer 
                  ${
                    slotIndex === index
                      ? "bg-[#5f6FFF] text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{daysOfWeek[firstSlot.datetime.getDay()]}</p>
                  <p>{firstSlot.datetime.getDate()}</p>
                </div>
              );
            })}
          </div>

          {/* --------- Time Slots --------- */}
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots[slotIndex]?.length > 0 ? (
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer 
                  ${
                    item.time === slotTime
                      ? "bg-[#5f6FFF] text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))
            ) : (
              <p className="text-gray-400">No slots available</p>
            )}
          </div>

          <button
            onClick={bookAppointment}
            className="bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book an appointment
          </button>
        </div>

        {/* -------------- Listing Related Doctors ---------------- */}
        <ReleatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
