import jwt from "jsonwebtoken";

export const generateTokenAndSetCokkie = (res ,userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    })
    res.cookie("token",token,{
        httpOnly:true, //only access in http
        secure:process.env.NODE_ENV === "production",
        samesite:"strict",//csrf
        maxAge: 7 * 24 * 60 * 60 * 1000,


    })
    return token;
}