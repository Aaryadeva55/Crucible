const { Worker } = require('bullmq')
const Submission = require('../models/submissionModel')
const logger = require('../utils/logger')
const connectDB = require('../config/db')

const connectionOptions = {
  host: 'localhost',
  port: 6379
}

const startWorker = async () => {
    try {
        await connectDB()
        logger.info("Worker connected to MongoDB")

        const submissionWorker = new Worker('submissionQueue', async job => {
            const submission = await Submission.findById(job.data.submissionId)

            if (!submission) {
                throw new Error('Submission not found')
            }

            submission.status = 'Running'
            await submission.save()

            await new Promise(resolve => setTimeout(resolve, 2000))

            submission.status = 'Accepted'
            submission.runtime = 120
            submission.memory = 1024
            await submission.save()
        }, { connection: connectionOptions })

    } catch (error) {
        logger.error("Failed to start worker", error)
        process.exit(1)
    }
}

startWorker()