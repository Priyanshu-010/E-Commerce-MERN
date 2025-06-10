import mongoose from "mongoose";

export const connectDb = async()=>{
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("DB connected"))
  } catch (error) {
    console.log("Error in db.js", error)
    process.exit(1) // 0 means success
  }
}