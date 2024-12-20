import { pool } from "../db.js";

export class sqlModel {
    
    //This method creates a new User
    static async createUser( newUser ) {
        let [data] = await pool.query('SELECT UUID() as uuid')
        let id

        if (data.length > 0) {
            id = data[0].uuid
        }

        const user = {
            id,
            ...newUser
        }

        const result = await pool.query(`insert into users(id,username,email,password)
        values(UUID_TO_BIN(?),?,?,?)`, [user.id, user.username, user.email, user.password])
        

        return user
    }

    //This method gets the user information by it's username
    static async getUser({ username }) {
        
        const [result] = await pool.query(`select username, email, password from users where username=?`, [username])


        return result[0]
    }

    static async createRoom(newRoom) {

        const result = pool.query(`insert into ConvoBox.rooms (name, private, description, likes) values(?,?,?,?)`, [newRoom.name, newRoom.private, newRoom.description, newRoom.likes])

        return result

    }

    static async getRoom({ roomName }) {
        
        const [result] = await pool.query(`select name, private, description, likes from ConvoBox.rooms where name = ?`,[roomName])
        
        return result[0]
    }

    static async sendMessage(messageBody) {
        
        const result = await pool.query('insert into ConvoBox.messages (`user_id`,`content`,`room_id`) values(UUID_TO_BIN(?), ?, UUID_TO_BIN(?))', [messageBody.user_id, messageBody.content, messageBody.room_id])

        return result
    }

    static async getRoomMessages({ roomName }) {
        
        const [result] = await pool.query('select username, content from from_to_messages where from_to_messages.name = ?', [roomName])

        return result
    }

    static async getFavoriteRooms({ userID }) {

        const [result] = await pool.query('select * from show_users_favorites where id = UUID_TO_BIN(?)', [userID])

        return result
    }

    static async addFavoriteRoom({ userID, roomID }) {
        
        const [result] = await pool.query('insert into ConvoBox.favorites (user_id, room_id) values(UUID_TO_BIN(?), UUID_TO_BIN(?))', [userID, roomID]) 
        
        return result
    }

    //TODO: Create a function that checks if a user exist
    //TODO: Create a function that checks if a room exist
    //TODO: implement both every time we work with a team or user
}