const express = require('express')
require('express-async-errors')
const app = express()
const authRouter = require('./routes/auth')
const musicRouter = require('./routes/music')
const notFoundMiddleWare = require('./middlewares/not-found')
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const authMiddleware = require('./middlewares/authentication')
require('dotenv').config()

const port = 3000 || process.env.PORT
// middlewares
app.use(express.json())

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/musics', authMiddleware, musicRouter)

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
