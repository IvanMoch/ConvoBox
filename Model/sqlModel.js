import { pool } from "../db.js";

export class sqlModel {
    
    //This method creates a new User
    static async createUser( newUser ) {

        const result = await pool.query(`insert into users(username,email,password, profile_photo, description)
        values(?,?,?,?,?)`, [newUser.username, newUser.email, newUser.password, newUser.userImage, newUser.description])
        

        if (result.affectedRows > 0) {
            return user
        }
        
    }

    static async modifyRoom(room) {
        
        const result = await pool.query(`update ConvoBox.rooms set name=?, description=? where name=?`, [room.name, room.description, room.name])

        return result
    }

    static async modifyUser(user) {

        const result = await pool.query(`update ConvoBox.users set username=?, email=?, description=? where username=?`, [user.username, user.email, user.description, user.username])

        return result
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

    //This method gets the user information by he's username
    static async getUser({ username, id }) {
        
        if (username) {
            const [result] = await pool.query(`select BIN_TO_UUID(id) as id, username, email, profile_photo, password, description from users where username=?`, [username])
            return result[0]
        }

        if (id) {    
            const [result] = await pool.query(`select BIN_TO_UUID(id) as id, username, email, profile_photo, password, description from users where id=UUID_TO_BIN(?)`, [id])
            return result[0]
        }
    }

    static async getManyUsers({ username }) {
        
        const searchUsername = '%' + username + '%'

        const [result] = await pool.query(`select BIN_TO_UUID(id) as id, username, email, profile_photo, password, description from users where username like ?`, [searchUsername])

        return result
    }

    static async createRoom(newRoom) {

        const result = pool.query(`insert into ConvoBox.rooms (name, description, likes) values(?,?,0)`, [newRoom.name, newRoom.description])

        return result

    }

    static async getSingleRoom({ roomName, id }) {
        
        if (roomName) {
            const [result] = await pool.query(`select BIN_TO_UUID(id) as id, name, private, description, likes from ConvoBox.rooms where name = ?`, [roomName])
            return result[0]
        }
        if (id) {
            const [result] = await pool.query(`select BIN_TO_UUID(id) as id, name, private, description, likes from ConvoBox.rooms where id = UUID_TO_BIN(?)`, [id])
            return result[0]
        }
    }

    static async getManyRooms({ name }) {
        
        const searchName = '%' + name + '%'

        const [result] = await pool.query(`select BIN_TO_UUID(id) as id, name, description, likes from ConvoBox.rooms where name like ?`, [searchName])

        return result
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

    static async deleteFavoriteRoom({ userID, roomID }) {
            
            const [result] = await pool.query('delete from ConvoBox.favorites where user_id = UUID_TO_BIN(?) and room_id = UUID_TO_BIN(?)', [userID, roomID])
    
            return result
        }
}