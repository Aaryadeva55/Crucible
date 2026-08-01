const express = require('express')
const router = require('./routes/rootRoute')
const userRouter = require('./routes/userRoute')
const loginRouter = require('./routes/loginRoute')
const problemRouter = require('./routes/problemRoute')
const submissionRouter = require('./routes/submissionRoute')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(express.json())
app.use('/', router)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/problems', problemRouter)
app.use('/api/submissions', submissionRouter)
app.use(errorHandler)

module.exports = app