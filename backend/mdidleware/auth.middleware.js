import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if(!token){
      return res.status(401).json({message: "Unauthorized Access Token not found"});
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password")// select removes password from response

      if(!user){
        return res.status(401).json({message: "User not found"});
      }

      req.user = user;
      next();
    } catch (error) {
      if(error.name === "TokenExpiredError"){
        return res.status(401).json({message: "Token Expired"});
      }

      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute", error.message);
    res.status(500).json({message: "Internal Server Error", error: error.message});
  }
}
export const adminRoute = async (req, res, next) => {
  if(req.user && req.user.role === "admin"){
    next();
  }else{
    return res.status(403).json({message: "Access Denied - Admin Only"});
  }
}