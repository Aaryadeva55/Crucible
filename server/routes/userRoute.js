const userRouter = require('express').Router()
const { userPost, userGet } = require('../controllers/userController')

userRouter.get('/', userGet)
userRouter.post('/', userPost)

module.exports = userRouter