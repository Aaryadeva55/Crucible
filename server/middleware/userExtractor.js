const getTokenFrom = require('./tokenExtractor')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const User = require('../models/userModel')

const userExtractor = async (req, res, next) => {
    const decodedToken = jwt.verify(req.token, config.SECRET)
    
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
        return res.status(401).json({ error: 'Invalid authentication token' })
    }

    req.user = user

    next()
}