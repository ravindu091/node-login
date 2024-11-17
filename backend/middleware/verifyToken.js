import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({msg:"unautorized "});
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({msg:"not valid token "});
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({msg:"not valid token "});
    }
    

}