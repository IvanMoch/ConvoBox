import { sqlModel } from "../Model/sqlModel.js"
import { validateRoom } from "../Schemas/roomSchema.js"

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

    static modifyRoom = async (req, res) => {
        
    }
}