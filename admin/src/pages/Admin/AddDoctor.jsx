import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets_admin/assets'
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify'
import axios from 'axios'
const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!docImg) {
      return toast.error("Image Not Selected");
    }
    const formData = new FormData();

    formData.append("image", docImg);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('experience', experience);
    formData.append('about', about);
    formData.append('fee', Number(fees));
    formData.append('speciality', speciality);
    formData.append('degree', degree);
    formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

    formData.forEach((item, key) => {
      console.log(item);
    })

    const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } });

    if (data.success) {
      toast.success(data.message);
      setDocImg(false);
      setName('');
      setEmail('');
      setPassword('');
      setExperience('1 Year');
      setAbout('');
      setAddress1('');
      setAddress2('');
      setSpeciality('General physician')
      setDegree('');
      setFees('');
    }
    else {
      toast.error(data.message);
    }
  }

  return (
    <div className="bg-[#F8F9FD] w-full font-sans h-[calc(100vh-80px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-blue-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Doctor</h1>
          <p className="text-gray-500 mt-1">Register a new medical professional to the system.</p>
        </div>

        <form onSubmit={onSubmitHandler} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Profile Upload Section */}
          <div className="flex items-center gap-6 mb-10 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <label htmlFor="doc-img" className="group cursor-pointer relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform">
                <img
                  className="w-full h-full object-cover"
                  src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                  alt="Upload"
                />
              </div>
              {!docImg && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full group-hover:bg-black/10 transition-colors">
                  <span className="sr-only">Upload Image</span>
                </div>
              )}
            </label>
            <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id='doc-img' hidden />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Profile Photo</h3>
              <p className="text-sm text-gray-500 max-w-xs">Upload a professional photo. Preferred size: 500x500px.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">

            {/* Left Column - Personal Info */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">Personal Details</h4>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Doctor Name</label>
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. Dr. Richard James" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="doctor@example.com" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Set Password</label>
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="••••••••" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience</label>
                <div className="relative">
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer" onChange={(e) => setExperience(e.target.value)} value={experience}>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Year">2 Year</option>
                    <option value="3 Year">3 Year</option>
                    <option value="4 Year">4 Year</option>
                    <option value="5 Year">5 Year</option>
                    <option value="6 Year">6 Year</option>
                    <option value="7 Year">7 Year</option>
                    <option value="8 Year">8 Year</option>
                    <option value="9 Year">9 Year</option>
                    <option value="10 Year">10 Year</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consultation Fees</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  <input onChange={(e) => setFees(e.target.value)} value={fees} type="number" className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="0" required />
                </div>
              </div>
            </div>

            {/* Right Column - Professional Info */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">Professional Info</h4>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Speciality</label>
                <div className="relative">
                  <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="General physician">General physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatricians">Pediatricians</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Education / Degree</label>
                <input onChange={(e) => setDegree(e.target.value)} value={degree} type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. MBBS, MD" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Clinic Address</label>
                <div className="space-y-3">
                  <input onChange={(e) => setAddress1(e.target.value)} value={address1} type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="Address Line 1" required />
                  <input onChange={(e) => setAddress2(e.target.value)} value={address2} type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="Address Line 2" required />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">About Doctor</label>
            <textarea onChange={(e) => setAbout(e.target.value)} value={about} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-y min-h-[120px]" placeholder="Write a short biography about the doctor..." rows={5} required />
          </div>

          <button type='submit' className="mt-10 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Add Doctor
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddDoctor
