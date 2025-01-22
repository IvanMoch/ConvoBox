import jwt from "jsonwebtoken"
import { sqlModel } from "../Model/sqlModel.js"
import { validatePartialUser, validateUser } from "../Schemas/userSchema.js"
import bcryptjs from 'bcryptjs'
import { SECRET_KEY } from "../config.js"


export class UserController{
    
    static getSingleUser = async (req, res) =>{
        const { username } = req.params
        
        const userInfo = await sqlModel.getUser({ username })
        
        if (userInfo) {
            return res.status(200).json(userInfo)
        }

        return res.status(400).json({message: 'User not found'})
    }

    static getManyUsers = async (req, res) => {
        const { username } = req.params
        
        try {
            const result = await sqlModel.getManyUsers({ username })
            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'error while fetching' })
        }
    }

    static createUser = async (req, res) => {
        
        const newUser = validateUser(req.body)

        if (newUser.error) {
            return res.status(404).json({error: "Check the values"})
        }

        const user = newUser.data

        if (await sqlModel.checkUser({ username: user.username })) {
            return res.status(400).json({message: 'User already exist'})
        }

        const hashedPassword = await bcryptjs.hash(user.password,10)

        user.password = hashedPassword

        user.userImage = `uploads/profile-picture/${req.file.filename}` //save the image path to the database

        const result = await sqlModel.createUser(user)

        
        return res.status(200).json(result)
    }

    static logUser = async (req, res) => {
        
        const { username, password } = req.body
        
        const user = await sqlModel.getUser({ username })
        const checkedPassword = await bcryptjs.compare(password, user.password)
        if (user && checkedPassword) {
            const profilePicture = `${req.protocol}://${req.get('host')}/${user.profile_photo}`
            const token = jwt.sign({ username: user.username, email: user.email, id: user.id, profilePicture: profilePicture, description: user.description }, SECRET_KEY, { expiresIn: '1h' })
            return res.status(200).cookie('accessToken', token).json(user)
        }

        return res.status(400).send('something goes wrong')
    }

    static logOut = async (req, res) => {
        //const token = req.cookies.accessToken
        return res.clearCookie('accessToken').render('login')
    }

    static deleteUser = async (req, res) => {
        
    }

    static modifyUser = async (req, res) => {
        
        const verifiedUser = await validatePartialUser(req.body)

        if (verifiedUser.error) {
            return res.status(400).json({message: 'Check the values'})
        }

        const user = verifiedUser.data

        try {
            const result = await sqlModel.modifyUser(user)

            if (result) {
                return res.status(200).json({message : 'User saved successfully'})
            }

            return res.status(400).json({message: 'Error while modifying'})
        } catch (error) {
            console.log(error)
            return res.status(400).json({message: 'error while modifying'})
        }
    }
}