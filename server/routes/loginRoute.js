const loginRouter = require('express').Router()
const { loginPost } = require('../controllers/loginController')

loginRouter.post('/', loginPost)

module.exports = loginRouter