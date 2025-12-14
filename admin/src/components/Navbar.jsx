import React, { useContext } from 'react'
import {assets} from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'
import {useNavigate} from 'react-router-dom';
import {DoctorContext} from '../context/DoctorContext';
import { StaffContext } from '../context/StaffContext';

export default function Navbar() 
{
    const {aToken, arole, setAToken, setARole} = useContext(AdminContext);
    const {dToken, drole, setDToken, setDRole} = useContext(DoctorContext);
    const {sToken, srole, setSToken, setSRole} = useContext(StaffContext);
    const navigate = useNavigate();

    const logout = () => {
      // ADMIN
      if (arole === 'admin') {
        setAToken('');
        setARole('');
        localStorage.removeItem('aToken');
        localStorage.removeItem('arole');
      }
    
      // DOCTOR
      else if (drole === 'doctor') {
        setDToken('');
        setDRole('');
        localStorage.removeItem('dToken');
        localStorage.removeItem('drole');
      }
    
      // STAFF
      else if (srole === 'staff') {
        setSToken('');
        setSRole('');
        localStorage.removeItem('sToken');
        localStorage.removeItem('srole');
      }
    
      navigate('/');
    };


  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-sm'>
        <img className='w-35 sm:w-40 cursor-pointer' src={assets.admin_logo}/>
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">{aToken ? "Admin" : dToken ? "Doctor" : "Staff"}</p>

      </div>
      <button onClick={logout} className='bg-[#5F6FFF] text-white text-sm px-10 py-2 rounded-full cursor-pointer'>LogOut</button>
    </div>
  )
}
