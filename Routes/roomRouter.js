import { Router } from "express";
import { roomsController } from "../Controller/roomsController.js";


export const roomRouter = new Router()

roomRouter.get('/search/:roomName', roomsController.getRoom)
roomRouter.post('/create', roomsController.createRoom)
roomRouter.patch('/modify/:roomName', roomsController.modifyRoom)
roomRouter.post('/senMessage', roomsController.sendMessage)
roomRouter.get('/getMessages/:roomName', roomsController.getRoomMessages)
roomRouter.post('/addFavorite', roomsController.addFavoriteRoom)
roomRouter.get('/favoritesRooms/:userID', roomsController.getFavoriteRooms)