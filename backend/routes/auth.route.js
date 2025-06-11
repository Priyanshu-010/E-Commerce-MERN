import express from "express"
import { login, logout, refreshToken, signup } from "../controllers/auth.controller.js"

const Router = express.Router()

Router.post("/signup", signup);
Router.post("/login", login);
Router.post("/logout", logout);
Router.post("/refresh-token", refreshToken);

export default Router