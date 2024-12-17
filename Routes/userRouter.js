import { Router } from "express";
import { UserController } from "../Controller/userController.js";

export const userRouter = new Router()

userRouter.get('/search/:username', UserController.getUserInf)
userRouter.post('/signUp', UserController.createUser)
userRouter.patch('/modify/:username', UserController.modifyUser)
userRouter.post('/logIn', UserController.logUser)
userRouter.get('/logOut', UserController.logOut)


