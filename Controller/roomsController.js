import { sqlModel } from "../Model/sqlModel.js"
import { validateRoom } from "../Schemas/roomSchema.js"
import { validateMessage } from "../Schemas/messageSchema.js"
import { json } from "express"

export class roomsController {

    static createRoom =  async (req, res) => {
        
        const newRoom = validateRoom(req.body)

        console.log(req.body)

        if (newRoom.error) {
            return res.status(400).json({message : 'Check the values'})
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
        
        const result = await sqlModel.addFavoriteRoom({ userID, roomID })
        
        if (result) {
            return res.status(200).json({success : true})
        }

        return res.status(400).json({success : false})

    }

    static modifyRoom = async (req, res) => {
        
    }
}