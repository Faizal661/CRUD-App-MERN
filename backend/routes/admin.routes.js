import express from 'express'
import {verifyToken} from '../utils/verifyUser.js'
import { getUsers,getUser } from '../controllers/admin.controller.js'


const router =express.Router()

router.get('/',verifyToken,getUsers)
router.get('/users/:id',verifyToken,getUser)

export default router