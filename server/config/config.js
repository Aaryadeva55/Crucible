const path = require('path')
require('dotenv').config({
    path: path.join(__dirname, '../.env')
})

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.SECRET

module.exports = { PORT, MONGODB_URI, SECRET }

