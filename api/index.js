import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AUthRoute from './routes/Auth.js';
import UserRoute from './routes/User.js';
import PostRoute from './routes/Post.js';
import errorMiddleware from './Middlewares/ErrorMiddleware.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(errorMiddleware);
app.use("/auth", AUthRoute);
app.use("/users", UserRoute);
app.use("/posts", PostRoute);

mongoose.connect("mongodb+srv://socialmedia:socialmedia123@cluster0.odsvacz.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("MONGO DB is connected"))
    .catch((err) => console.log("MONGO DB connection failed", err));

app.listen(8800, () => {
    console.log("API IS WORKING");
});
