const express = require('express')
const router = require('./routes/rootRoute')
const userRouter = require('./routes/userRoute')
const loginRouter = require('./routes/loginRoute')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(express.json())
app.use('/', router)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(errorHandler)

module.exports = app