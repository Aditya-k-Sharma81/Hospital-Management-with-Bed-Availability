import React, { useContext } from 'react';
import Login from './pages/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';
import { StaffContext } from './context/StaffContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Admin/Dashboard';
import AddDoctor from './pages/Admin/AddDoctor';
import AllAppointment from './pages/Admin/AllAppointment';
import DoctorsList from './pages/Admin/DoctorsList';
import Add_Bed from './pages/Admin/Add_Bed';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import Staff_Dashboard from './pages/Staff/Staff_Dashboard';
import BedAvailability from './pages/Staff/BedAvailability';

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const { sToken } = useContext(StaffContext);


  // ---------------------------------------------------
  // 1️⃣ ADMIN LOGGED IN → SHOW ADMIN UI
  // ---------------------------------------------------
  if (aToken) {
    return (
      <div className='bg-[#eff1f6]'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/all-appointments' element={<AllAppointment />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctor-list' element={<DoctorsList />} />
            <Route path='/add-bed' element={<Add_Bed />} />
          </Routes>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------
  // 2️⃣ DOCTOR LOGGED IN → SHOW DOCTOR UI
  // ---------------------------------------------------
  if (dToken) {
    return (
      <div className='bg-[#eff1f6]'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          </Routes>
        </div>
      </div>
    );
  }


  if (sToken) {
    return (
      <div className='bg-[#eff1f6]'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<></>}></Route>
            <Route path='/staff-dashboard' element={<Staff_Dashboard />} />
            <Route path='/staff-bed-availability' element={<BedAvailability />} />
          </Routes>
        </div>
      </div>
    );
  }



  // ---------------------------------------------------
  // 3️⃣ NO TOKEN → SHOW LOGIN PAGE
  // ---------------------------------------------------
  return (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
