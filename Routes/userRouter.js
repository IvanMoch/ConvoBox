import { Router } from "express";
import { UserController } from "../Controller/userController.js";

export const userRouter = new Router()

userRouter.get('/:username', UserController.getUserInf)
userRouter.post('/signUp', UserController.createUser)
userRouter.patch('/:username', UserController.modifyUser)
userRouter.post('/logIn', UserController.logUser)


