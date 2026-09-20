const testCasesRouter = require('express').Router()

const {
    createTestCase,
    getProblemTestCases,
    updateTestCase,
    deleteTestCase
} = require('../controllers/testCaseController')

const tokenExtractor = require('../middleware/tokenExtractor')
const userExtractor = require('../middleware/userExtractor')

testCasesRouter.post(
    '/:problemSlug',
    tokenExtractor,
    userExtractor,
    createTestCase
)

testCasesRouter.get(
    '/:problemId',
    getProblemTestCases
)

testCasesRouter.patch(
    '/:id',
    tokenExtractor,
    userExtractor,
    updateTestCase
)

testCasesRouter.delete(
    '/:id',
    tokenExtractor,
    userExtractor,
    deleteTestCase
)

module.exports = testCasesRouter