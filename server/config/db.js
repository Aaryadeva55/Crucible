const mongoose = require('mongoose')
const config = require('./config')
const logger = require('../utils/logger')

const connectDB = async () => {
    logger.info('connecting to MongoDB...')
    await mongoose.connect(config.MONGODB_URI, { family: 4 })
    logger.info('connected to MongoDB')
}

module.exports = connectDB