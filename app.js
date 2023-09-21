const express = require('express')
require('express-async-errors')
const helmet = require('helmet')
const cors = require('cors')

const app = express()

const authRouter = require('./routes/auth')
const musicRouter = require('./routes/music')

const connectDB = require('./db/connect')

const notFoundMiddleWare = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const authMiddleware = require('./middlewares/authentication')
require('dotenv').config()

const port = 3000 || process.env.PORT
// middlewares
app.use(express.json())
app.use(helmet())
app.use(cors())

// routes

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/musics', authMiddleware, musicRouter)
app.use(express.static('./src'))

app.use(notFoundMiddleWare)
app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Listening on server ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
