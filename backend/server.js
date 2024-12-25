import express from "express";
import userRoutes from './routes/user.routes.js'
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./config/database.js";
import { errorHandler } from "./utils/error.handler.js";

connectDB();
 
const app = express();

app.use(express.json())

app.listen(3000, () => {
  console.log("Server is started : 3000");
});
        
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)


app.use(errorHandler) 