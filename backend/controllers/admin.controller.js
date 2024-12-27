import User from "../models/user.model.js"
import { customErrorHandler } from "../utils/error.handler.js";

export const getUsers=async(req,res,next)=>{
 try {
    const usersList=await User.find({},{password:0})
    return res.status(200).json(usersList)
 } catch (error) {
    next(error)
 }
}

export const getUser=async(req,res,next)=>{
    try {
        const userId=req.params.id
       const user=await User.findById({_id:userId},{password:0})
       return res.status(200).json(user)
    } catch (error) {
       next(error)
    }
   }            