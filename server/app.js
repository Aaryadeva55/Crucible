const express = require('express')
const router = require('./routes/rootRoute')
const userRouter = require('./routes/userRoute')

const app = express()

app.use(express.json())
app.use('/', router)
app.use('/api/users', userRouter)

module.exports = app