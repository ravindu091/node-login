import mongoose from "mongoose";


export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`mongo db connected  ${conn.connection.host} : ${conn.connection.port}`);
        
    } catch (error) {
        console.log('Error Connection to mongo DB', error.message);
        process.exit(1)
        
    }
}