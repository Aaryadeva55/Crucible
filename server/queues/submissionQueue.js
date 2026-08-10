const { Queue } = require('bullmq')

const connectionOptions = {
  host: 'localhost',
  port: 6379
}

const submissionQueue = new Queue('submissionQueue', { connection: connectionOptions })

module.exports = submissionQueue