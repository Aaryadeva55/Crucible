const app = require('./app')
const config = require('./config/config')
const logger = require('./utils/logger')
const connectDB = require('./config/db')

const startServer = async () => {
    try {
        await connectDB()
        app.listen(config.PORT, () => {
            logger.info(`Server running on port ${config.PORT}`)
        })
    } catch (error) {
        logger.error("Failed to start server:", error)
        process.exit(1)
    }
}

startServer()