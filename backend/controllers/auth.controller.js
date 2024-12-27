import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { customErrorHandler } from "../utils/error.handler.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const existingUserName = await User.findOne({ username });
        if (existingUserName) return next(customErrorHandler(409, "Username is already taken."));
        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) return next(customErrorHandler(409, "Email is already taken."));
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created successfully...." });
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const validUser = await User.findOne({ email });
        if (!validUser) return next(customErrorHandler(404, "User Not Found"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(customErrorHandler(401, "wrong credentials"));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = validUser._doc
        const expire_time = new Date(Date.now() + 60 * 60 * 1000)
        res
            .cookie("access_token", token, { httpOnly: true, expires: expire_time })
            .status(200)
            .json(rest);
    } catch (error) {
        next(error);
    }
};


export const signout = (req, res) => {
    res.clearCookie('access_token').status(200).json("Signout successfully.")
} 