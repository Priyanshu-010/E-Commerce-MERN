import {redis} from "../lib/redis.js"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

const generateToken = (userId) =>{
  const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m"
  })
  const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d"
  })

  return {accessToken, refreshToken};
}

const storeRefreshToken = async(userId, refreshToken)=>{
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 60 * 60 * 24 * 7);
}

const setCookies = (res, accessToken, refreshToken)=>{
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
}

export const signup = async (req, res)=>{
  try {
    const {name, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
      return res.status(400).send("User already exists");
    }
    
    const user = await User.create({name, email, password});

    const {accessToken, refreshToken} = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken)

    setCookies(res, accessToken, refreshToken);
    res.status(201).send({
      user:{
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: "User Created Successfully"
    });
  } catch (error) {
      res.status(500).send(error.message, "Internal Server Error");
  }
}
export const login = (req, res)=>{
  res.send("login")
}
export const logout = (req, res)=>{
  res.send("logout")
}