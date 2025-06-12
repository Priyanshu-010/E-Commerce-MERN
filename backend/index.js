import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/auth.route.js"
import productRouter from "./routes/product.route.js"
import cookieParser from "cookie-parser";
import { connectDb } from "./lib/db.js";

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
  connectDb();
})