import type { Express } from "express";
import mongoose from "mongoose";
import { getEnv } from "../utils/env";

export function bootstrap(app: Express) {
  const { dbUrl, port } = getEnv();

  if (!dbUrl) throw new Error("Database URL is required");

  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("Database connected");

      app.listen(port, () => console.log("Server is running in port", port));
    })
    .catch(() => {
      console.log("Databse failed to connect");
    });
}
