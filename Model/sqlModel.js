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
}