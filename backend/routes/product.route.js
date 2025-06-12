import express from "express";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeatureProduct } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../mdidleware/auth.middleware.js";

const Router = express.Router();

Router.get("/",protectRoute, adminRoute, getAllProducts);
Router.get("/featured", getFeaturedProducts);
Router.get("/recommendations", getRecommendedProducts);
Router.get("/category/:category", getProductsByCategory);
Router.post("/",protectRoute, adminRoute, createProduct);
Router.patch("/",protectRoute, adminRoute, toggleFeatureProduct);
Router.delete("/:id",protectRoute, adminRoute, deleteProduct);

export default Router