const express = require('express')
const app = express()

const port = 3000 || process.env.PORT

const authRouter = require('./routes/auth')
const musicRouter = require('./routes/music')

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/musics', musicRouter)

app.listen(port, console.log(`Listening on server ${port}`))
