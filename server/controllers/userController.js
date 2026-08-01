const User = require('../models/userModel')
const Submission = require('../models/submissionModel')
const bcrypt = require('bcrypt')

exports.userGet = async (req, res) => {
    const users = await User.find({})
    res.json(users)
}

exports.userPost = async (req, res) => {
    const { username, email, password } = req.body

    if (!password || password.length < 8) {
        return res.status(400).json({error: "Password length must be at least 8"})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        email,
        passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
}

exports.userSubmissions = async (req, res) => {
    const submissions = await Submission.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(submissions)
}