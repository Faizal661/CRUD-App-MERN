import User from "../models/user.model.js"
import { customErrorHandler } from "../utils/error.handler.js"
import bcryptjs from 'bcryptjs'


export const updateUser = async (req, res, next) => {
    try {
        const { username,email  } = req.body;
        const existingUserName = await User.findOne({ username,_id: { $ne: req.params.id }  });
        if (existingUserName) return next(customErrorHandler(409, "Username is already taken."));
        const existingUserEmail = await User.findOne({ email ,_id: { $ne: req.params.id } });
        if (existingUserEmail) return next(customErrorHandler(409, "Email is already taken."));

        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }
        }, {
            new: true
        })

        const { password, ...rest } = updatedUser._doc
        return res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}


export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id)

        return res.status(200).json('User has been deleted.')
    } catch (error) {
        next(error)
    }
}