import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("connnected to MONGODB"))
  .catch((error) => console.error(error));

const app = express();

app.listen(3000, () => {
  console.log("Server is started : 3000");
});
        