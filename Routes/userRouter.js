import { Router } from "express";
import { UserController } from "../Controller/userController.js";
import { upload } from "../Middleware/upload.js";

export const userRouter = Router()

userRouter.get('/search/:username', UserController.getUserInf)
userRouter.post('/signUp', upload.single('profilePicture'), UserController.createUser)
userRouter.patch('/modify/:username', UserController.modifyUser)
userRouter.post('/logIn', UserController.logUser)
userRouter.get('/logOut', UserController.logOut)


