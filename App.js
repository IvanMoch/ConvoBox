import express from 'express'
import { userRouter } from './Routes/userRouter.js'


const app = express()

app.use(express.json())


app.get('/', (req, res) => {
    res.json({message: 'Hey hey'})
})

app.use('/api/user', userRouter)

app.listen(3000, (req, res) => {
    console.log(`Server listening on: http://localhost:3000/`)
})