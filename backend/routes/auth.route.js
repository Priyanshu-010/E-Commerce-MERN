import express from "express"
import { login, logout, signup } from "../controllers/auth.controller.js"

const Router = express.Router()

Router.get("/signup", signup);
Router.get("/login", login);
Router.get("/logout", logout);

export default Router