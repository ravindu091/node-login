import { User } from'../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCokkie } from '../utils/generateTokenAndSetCokkie.js';
import { sendPasswordRestEmail, sendVerificationEmail } from '../mailtrap/emails.js';
import crypto from 'crypto';


export const signup = async (req,res)=>{
    const {body:{email,password , name}} = req;
    try {
        
        if(!email || !password || !name){
            throw new Error('All fields are required')
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success:false,msg:"User already exists"});
        }
        const hashedPassword = await bcryptjs.hash(password,10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
      
        
        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken:verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60* 60* 1000  //24 Hours

        })
        await user.save();
        
        
        //jwt
        generateTokenAndSetCokkie(res,user._id);

        await sendVerificationEmail(email,user.name,verificationToken);

        res.status(201).json({success:true, message:'user created',
            user:{
                userId:user._id,
                email:user.email,
                name:user.name
            },
        })

    } catch (error) {
        return res.status(400).json({success:false,msg:'1'+error.message});
    }
    
    
}

export const verifyEmail = async (req,res)=>{
    const{code,email} = req.body;
    if(!code || !email){
        return res.status(400).send({msg:"all fields are required"})
    }
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(400).send({msg:"user not found"})
    }
    if(user.verificationTokenExpiresAt < Date.now()){
        return res.status(400).send({msg:"verification token expired"})
    }
    
    if(user.verificationToken === code){

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        return res.status(200).send({msg:"verification successful"})
    }else{
        return res.status(400).send({msg:"verification failed"})
    }

}
export const login = async (req,res)=>{
    const {email , password} = req.body;
    if(!email || !password){
        return res.send({msg:'invalid credentials'})

    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send({msg:'user not found'})
        }
        const isPaswordValid = await bcryptjs.compare(password,user.password);
        if(!isPaswordValid){
            return res.status(400).send({msg:'invalid credentials'})
        }

        const token = generateTokenAndSetCokkie(res,user._id);
        
        user.lastLogin = Date.now();

        await user.save();
        return res.status(200).send({msg:'login successful',user:{
            ...user._doc,
            password:undefined
        }})

    }catch(error){
        console.log("login error",error.message);
        throw new Error(error.message);
    }
    
    
}
export const logout = async (req,res)=>{
    res.clearCookie('token');
    res.status(200).send({msg:"logout successful"})
    
}

export const forgotPassword = async (req,res)=>{
    const {email} = req.body;   
    try{
        const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({msg:"user not found"});
    }
    //Generate reset token

    const restToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 Hour
    user.resetPasswordToken = restToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    //send email
    await sendPasswordRestEmail(email,`${process.env.CLIENT_URL}/reset-password/${restToken}`)


    return res.status(200).json({msg:"password reset email sent"})

    }catch(error){
        console.log("forgot password error",error.message);
        res.status(400).json({msg:error.message})
    }

}


