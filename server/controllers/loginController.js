const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const config = require('../config/config')


exports.loginPost = async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username })

    const passwordCorrect = user === null 
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({ error: "Invalid username or password" })
    }

    const userForToken = {
        id: user.id
    }

    const token = jwt.sign(userForToken, config.SECRET, { expiresIn: "1h" })

    res.status(200).json({ token, username: user.username, email: user.email, id: user.id})
}