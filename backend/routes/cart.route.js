import express from "express"
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../mdidleware/auth.middleware.js";

const Router = express.Router();

Router.get("/",protectRoute , getCartProducts)
Router.post("/",protectRoute , addToCart)
Router.delete("/",protectRoute , removeAllFromCart)
Router.put("/:id",protectRoute , updateQuantity)

export default Router;