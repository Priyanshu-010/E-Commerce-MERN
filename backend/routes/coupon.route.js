import express from "express"
import { protectRoute } from "../mdidleware/auth.middleware.js";
import { getCoupons, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupons)
router.get("/validate", protectRoute, validateCoupon)

export default router