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
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {

    const accessToken = req.cookies.accessToken

    try {
        const data = jwt.verify(accessToken, SECRET_KEY)
        res.render('main', data)
    } catch (error) {
        res.render('login')
    }
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

    try {
        const data = jwt.verify(token, SECRET_KEY)
        res.render('main', data)
    } catch (error) {
        res.render('login')
    }
})

app.get('/profile', (req, res) => {
    const token = req.cookies.accessToken

    try {
        const data = jwt.verify(token, SECRET_KEY)
        res.render('userProfile', data)
    } catch (error) {
        console.log(error)
        res.status(400).send(`<h1>page not found</h1>`)
    }
})

app.get('/createUser', (req, res) => {
    res.render('createUser')
})

app.use('/api/user', userRouter)
app.use('/api/room', roomRouter)

server.listen(3000, (req, res) => {
    console.log(`Server listening on: http://localhost:3000/`)
})