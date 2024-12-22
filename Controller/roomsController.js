import { sqlModel } from "../Model/sqlModel.js"
import { validateRoom } from "../Schemas/roomSchema.js"
import { validateMessage } from "../Schemas/messageSchema.js"
import { json } from "express"

export class roomsController {

    static createRoom = async (req, res) => {
        
        
        const newRoom = validateRoom(req.body)

        if (await sqlModel.checkRoom({ name: newRoom.data.name })) {
            return res.status(400).json({message : 'Room already exist'})
        }

        if (newRoom.error) {
            return res.status(400).json({message : 'Check the values'})
        }

        if (await sqlModel.checkUser({ identifier: newRoom.data.name, field: 'name' })) {
            return res.status(400).json({message: 'user already exist'})
        }

        const result = sqlModel.createRoom(newRoom.data)

        if (result) {
            return res.status(200).json(newRoom.data)
        }

        return res.status(400).json({message: 'Query failed'})
    }

    static getRoom = async (req, res) => {

        const { roomName } = req.params
        
        const result = await sqlModel.getRoom({ roomName })
        
        if (result) {
            return res.status(200).json(result)
        }

        return res.status(400).json({message : "room not found"})
    }

    static sendMessage = async (req, res) => {
        const newMessage = validateMessage(req.body)

        if (!await sqlModel.checkRoom({ id: newMessage.data.room_id })) {
            return res.status(400).json({message: 'Room does not exist'})
        }

        if (!await sqlModel.checkUser({ id: newMessage.data.user_id })) {
            return res.status(400).json({message: 'User does not exist'})
        }

        const result = await sqlModel.sendMessage(newMessage.data)
        
        if (result) {
            return res.status(200).json(newMessage.data)
        }

        return res.status(400).json({message: "Something goes wrong"})

    }

    static getRoomMessages = async (req, res) => {

        const { roomName } = req.params

        const result = await sqlModel.getRoomMessages({ roomName })
        
        if (result) {
            return res.status(200).json(result)
        }

        return res.status(400).json({message: "something goes wrong"})
    }

    static getFavoriteRooms = async (req, res) => {

        const { userID } = req.params
        
        const result = await sqlModel.getFavoriteRooms({ userID })
        
        if (result) {
            return res.status(200).json(result)
        }

        return res.status(400).json({message : 'user not found'})
    }

    static addFavoriteRoom = async (req, res) => {

        const { roomID, userID } = req.body

        if (!(await sqlModel.checkRoom({ id: roomID }))) {
            return res.status(400).json({message: 'room does not exist'})
        }

        if (!(await sqlModel.checkUser({ id: userID }))) {
            return res.status(400).json({message: 'user does not exist'})
        }
        
        const result = await sqlModel.addFavoriteRoom({ userID, roomID })
        
        if (result) {
            return res.status(200).json({success : true})
        }

        return res.status(400).json({success : false})

    }

    static modifyRoom = async (req, res) => {
        
    }
}