import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : false);
    const [userData,setuserData] = useState();

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/doctor/list");

            if (data.success) 
            {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error.message);
            toast.error("Failed to load doctors: " + error.message);
        }
    };

    const loadUserProfileData = async() => {
        try 
        {
            const {data} = await axios.get(backendUrl + "/api/user/get-profile", {headers:{token}})
            if(data.success)
            {
                setuserData(data.userData);
                console.log(data.userData.address.line1 + " " + data.userData.address.line2);
            }
            else
            {
                setuserData(null);           
                toast.error(data.message);
            }
        }catch(error)
        {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(() => {
        if (token) 
        {
            loadUserProfileData();
        } 
        else 
        {
            setuserData(null);
        }
    }, [token]);

    const value = {
        doctors,
        getDoctorsData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setuserData,
        loadUserProfileData  
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
