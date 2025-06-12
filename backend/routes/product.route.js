import express from "express";
import { getAllProducts, getFeaturedProducts } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../mdidleware/auth.middleware.js";

const Router = express.Router();

Router.get("/",protectRoute, adminRoute, getAllProducts);
Router.get("/featured", getFeaturedProducts);

export default Router