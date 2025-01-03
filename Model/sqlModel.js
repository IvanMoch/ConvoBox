import { pool } from "../db.js";

export class sqlModel {
    
    //This method creates a new User
    static async createUser( newUser ) {

        const result = await pool.query(`insert into users(username,email,password)
        values(?,?,?)`, [newUser.username, newUser.email, newUser.password])
        

        if (result.affectedRows > 0) {
            return user
        }
        
    }

    //This method checks if a user exist
    static async checkUser({ id, username }) {
        
        let result 

        if (username) {
            [result] = await pool.query('select * from ConvoBox.users where username = ?', [username])
        }

        if (id) {
            [result] = await pool.query('select * from ConvoBox.users where id = UUID_TO_BIN(?)', [id])
        }

        
        if (result.length > 0) {
            return true
        }

        return false
    }

    //This method checks if a room exist
    static async checkRoom({ id, name }) {

        let result
        
        if (id) {
            [result] = await pool.query('select * from ConvoBox.rooms where id = UUID_TO_BIN(?)', [id])
        }


        if (name) {
            [result] = await pool.query('select * from ConvoBox.rooms where name = ?', [name])
        }


        if (result.length > 0) {
            return true
        }

        return false
    }

    //This function checks if a room is a favorite of a user

    static async checkFavoriteRoom({ userID, roomID }) {
            
            const [result] = await pool.query('select * from ConvoBox.favorites where user_id = UUID_TO_BIN(?) and room_id = UUID_TO_BIN(?)', [userID, roomID])
    
            if (result.length > 0) {
                return true
            }
    
            return false
        }

    //This method gets the user information by it's username
    static async getUser({ username }) {
        
        const [result] = await pool.query(`select BIN_TO_UUID(id) as id, username, email, password from users where username=?`, [username])


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

    static async getRoomMessages({ roomID }) {
        
        const [result] = await pool.query('select BIN_TO_UUID(roomID) as roomID, username, content from ConvoBox.from_to_messages where BIN_TO_UUID(roomID) = ?', [roomID])

        return result
    }

    static async getFavoriteRooms({ userID }) {

        const [result] = await pool.query('select BIN_TO_UUID(room_id) as id, name, description from show_users_favorites where id = UUID_TO_BIN(?)', [userID])

        return result
    }

    static async addFavoriteRoom({ userID, roomID }) {
        
        const [result] = await pool.query('insert into ConvoBox.favorites (user_id, room_id) values(UUID_TO_BIN(?), UUID_TO_BIN(?))', [userID, roomID]) 
        
        return result
    }

    static async getSuggestedRooms() {
        
        const [result] = await pool.query('select BIN_TO_UUID(id) as id,name, description, likes from rooms where private = 0 order by likes asc limit 9')

        return result
    }
}