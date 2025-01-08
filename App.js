import express from 'express'
import { fileURLToPath } from 'url'
import { userRouter } from './Routes/userRouter.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import path, { dirname } from 'path'
import { SECRET_KEY } from './config.js'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { roomRouter } from './Routes/roomRouter.js'


const app = express()
const server = createServer(app)
const io = new Server(server)
const __fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(__fileName)

app.use(express.static(path.join(__dirname, '/Public')))
app.use(express.json())
app.use(cookieParser())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {

    res.render('login')
})

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('message', (msg) => {
        io.to(msg.room).emit('message', msg)
    })


    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('joinRoom', (roomID) => {
        socket.join(roomID)
    })
})

app.get('/main', (req, res) => {
    const token = req.cookies.accessToken

    if (!token) {
        return res.render('login')
    }

    try {
        const data = jwt.verify(token, SECRET_KEY)
        res.render('main', data)
    } catch (error) {
        console.error(error)
        res.status(400).send('<h1>User not found</h1>')
    }
})

app.use('/api/user', userRouter)
app.use('/api/room', roomRouter)

server.listen(3000, (req, res) => {
    console.log(`Server listening on: http://localhost:3000/`)
})