import express from "express";
import { createProduct, getAllProducts, getFeaturedProducts } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../mdidleware/auth.middleware.js";

const Router = express.Router();

Router.get("/",protectRoute, adminRoute, getAllProducts);
Router.get("/featured", getFeaturedProducts);
Router.post("/",protectRoute, adminRoute, createProduct);

export default Router