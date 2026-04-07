 import mongoose from "mongoose";
 import dotenv from "dotenv";

dotenv.config();

const connectDB = () => {
    try{
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
} catch (err){
    console.log(err);
    
}
}

export default connectDB;