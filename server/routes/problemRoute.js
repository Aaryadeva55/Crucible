const problemRouter = require('express').Router()
const { 
    problemPost, 
    problemGetAll,
    problemGetOne
} = require('../controllers/problemController')
const tokenExtractor = require('../middleware/tokenExtractor')
const userExtractor = require('../middleware/userExtractor')

problemRouter.get('/', problemGetAll)
problemRouter.get('/:slug', problemGetOne)
problemRouter.post('/', tokenExtractor, userExtractor, problemPost)

module.exports = problemRouter