import  jwt  from "jsonwebtoken"
import { customErrorHandler } from "./error.handler.js";

export const verifyToken =(req,res,next)=>{
    const token =req.cookies.access_token;

    if(!token) return next(customErrorHandler(401,"You need to Login first..."))

    jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(customErrorHandler(401,'Token is invalid !!!'))

        req.user=user
        next();
    })

}