import { User } from'../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCokkie } from '../utils/generateTokenAndSetCokkie.js';

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
        res.status(201).json({success:true, message:'user created',
            user:{
                ...user._docs,
                password:undefined,
            },
        })

    } catch (error) {
        return res.status(400).json({success:false,msg:'1'+error.message});
    }
    
    
}
export const login = async (req,res)=>{
    res.send('log in')
    
}
export const logout = async (req,res)=>{
    res.send('log out')
    
}