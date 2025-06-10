import User from "../models/user.model.js"

export const signup = async (req, res)=>{
  try {
    const {name, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
      return res.status(400).send("User already exists");
    }

    const user = await User.create({name, email, password});
    res.status(201).send(user);
  } catch (error) {
    
  }
}
export const login = (req, res)=>{
  res.send("login")
}
export const logout = (req, res)=>{
  res.send("logout")
}