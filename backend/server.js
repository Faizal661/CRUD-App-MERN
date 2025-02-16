import express from "express";
import userRoutes from './routes/user.routes.js'
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { connectDB } from "./config/database.js";
import { errorHandler } from "./utils/error.handler.js";
import cookieParser from "cookie-parser";

connectDB();
 
const app = express();

app.use(express.json())

app.use(cookieParser())

app.listen(3000, () => {
  console.log("Server is started : http://localhost:3000/ ");
});
        
app.use('/api/auth',authRoutes) 
app.use('/api/user',userRoutes)
app.use('/api/admin',adminRoutes)

app.use(errorHandler)  