import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { bootstrap } from "./config/server";
import { errorHandler } from "./middleware/error";
import { authRouter } from "./modules/auth/route";

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use(errorHandler);

bootstrap(app);
