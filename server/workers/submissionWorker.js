const { Worker } = require('bullmq')
const Submission = require('../models/submissionModel')
const TestCase = require('../models/testCaseModel')
const logger = require('../utils/logger')
const connectDB = require('../config/db')
const runSubmission = require('../utils/codeRunner')

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

            const testCases = await TestCase.find({
                problem: submission.problem
            })

            if (!submission) {
                throw new Error('Submission not found')
            }

            submission.status = 'Running'
            await submission.save()

            const result = await runSubmission(submission.code, testCases)

            console.log('Judge result:', result)

            submission.status = result.status
            submission.failedTestCase = result.failedTestCase ?? null
            submission.actualOutput = result.actualOutput ?? null
            submission.expectedOutput = result.expectedOutput ?? null
            submission.runtime = result.runtime ? Math.round(result.runtime) : null
            submission.memory = 1024
            await submission.save()
        }, { connection: connectionOptions })

    } catch (error) {
        logger.error("Failed to start worker", error)
        process.exit(1)
    }
}

startWorker()