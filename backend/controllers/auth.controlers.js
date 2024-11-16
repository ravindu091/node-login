import { User } from'../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCokkie } from '../utils/generateTokenAndSetCokkie.js';
import { sendVerificationEmail } from '../mailtrap/emails.js';

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
    res.send('log in')
    
}
export const logout = async (req,res)=>{
    res.send('log out')
    
}

//cd C:\Program Files\MongoDB\Server\8.0\bin
