const submissionRouter = require('express').Router()
const { getSubmission } = require('../controllers/submissionController')
const tokenExtractor = require('../middleware/tokenExtractor')
const userExtractor = require('../middleware/userExtractor')

submissionRouter.get('/:id', tokenExtractor, userExtractor, getSubmission)

module.exports = submissionRouter