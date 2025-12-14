// API for adding doctor 
import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';

const addDoctor = async(req,res)=>{
    try
    {
        const {name,email,password, speciality,degree,experience, about,fees, address} = req.body;
        const imageFile = req.file;
        
        // Checking for all data to add doctor -------------
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile)
        {
            return res.json({suceess : false, message: "Missing Details"});
        }

        // Validating email format
        if(!validator.isEmail(email))
        {
            return res.json({success : false, message : "Please enter a valid email"})
        }

        // validating strong password

        if(password.length < 8)
        {
            return res.json({success : false, message : "Please enter a strong password"});
        }
        
        // hashing doctor password ------------

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // upload image to cloudinary -------------

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url;
        
        // Checking duplicate email 

        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) 
        {
          return res.json({ success: false, message: "Email already exists" });
        }


        await doctorModel.create({
          name,
          email,
          password: hashedPassword,
          speciality,
          degree,
          experience,
          about,
          fees,
          address,
          image: imageUrl
        });

        return res.json({ success: true, message: "Doctor Added Successfully" });
    }catch(err){
        console.log(err.message);
        res.send("Error");
    }
}

export {addDoctor};