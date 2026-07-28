const express = require('express')
const router = require('./routes/rootRoute')
const userRouter = require('./routes/userRoute')
const loginRouter = require('./routes/loginRoute')

const app = express()

app.use(express.json())
app.use('/', router)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

module.exports = app