import { sqlModel } from "../Model/sqlModel.js"
import { validateUser } from "../Schemas/userSchema.js"
import bcryptjs from 'bcryptjs'


export class UserController{
    
    static getUserInf = async (req, res) =>{
        const { username } = req.params
        
        const userInfo = await sqlModel.getUser({ username })
        
        if (userInfo) {
            return res.status(200).json(userInfo)
        }

        return res.status(400).json({message: 'User not found'})
    }

    static createUser = async (req, res) => {
        const newUser = validateUser(req.body)

        if (newUser.error) {
            return res.status(404).json({error: "Check the values"})
        }

        const user = newUser.data

        const hashedPassword = await bcryptjs.hash(user.password,10)

        user.password = hashedPassword


        const result = await sqlModel.createUser(user)

        
        return res.status(200).json(user)
    }

    static deleteUser = async (req, res) => {
        
    }

    static modifyUser = async (req, res) => {
        res.send('...')
    }
}