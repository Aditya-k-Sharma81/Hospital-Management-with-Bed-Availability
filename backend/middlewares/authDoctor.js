import jwt from 'jsonwebtoken';

// user authentication middleware 

const authDoctor = async(req,res,next)=>{
    try
    {
        const {token} = req.headers;

        if(!token)
        {
            return res.json({success:false, message:'Not Authorized Login Again'});
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id;
        
        next();
    }catch(err)
    {
        console.log(err);
        return res.json({ success: false, message: err.message });
    }
}

export default authDoctor;