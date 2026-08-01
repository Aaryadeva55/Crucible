const userRouter = require('express').Router()
const { userPost, userGet, userSubmissions } = require('../controllers/userController')
const tokenExtractor = require('../middleware/tokenExtractor')
const userExtractor = require('../middleware/userExtractor')

userRouter.get('/', userGet)
userRouter.post('/', userPost)
userRouter.get('/me/submissions', tokenExtractor, userExtractor, userSubmissions)

module.exports = userRouter