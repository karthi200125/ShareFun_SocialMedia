import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import AuthRouter from './Routes/AuthRoute.js';
import UserRouter from './Routes/UserRoute.js';
import ProductRouter from './Routes/ProductRoute.js';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));


// Routers
app.use("/auth", AuthRouter)
app.use("/user", UserRouter)
app.use("/product", ProductRouter)

// MONGO DB CONNECTION
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed", err));

app.listen(8800, () => {
  console.log("API is working on port 8800");
});
