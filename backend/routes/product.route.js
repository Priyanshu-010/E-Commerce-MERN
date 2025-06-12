import express from "express";
import { getAllProducts } from "../controllers/product.controller.js";

const Router = express.Router();

Router.get("/", getAllProducts)

export default Router