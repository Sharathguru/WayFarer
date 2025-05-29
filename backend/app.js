import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import itenaryRoutes from "./routes/itenary.routes.js";
import { rateLimit } from 'express-rate-limit';
import stripeRoutes from './routes/stripe.routes.js'
import webhookRoute from './routes/webhook.routes.js'
import cors from "cors";

connectDB();
let app = express();

//middleware stack
app.use("/api/v1/stripe/webhook",express.raw({ type: 'application/json' }))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)
app.use(cors()) // Enable CORS for all routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/itenaries",itenaryRoutes)
app.use('/api/v1/stripe', stripeRoutes);
app.use("/api/v1/stripe/webhook",webhookRoute)


app.all("*", (req, res, next) => {
  let err = new Error("Page not found");
  err.statusCode = 404;
  next(err);
});

//global error handler
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

export default app;