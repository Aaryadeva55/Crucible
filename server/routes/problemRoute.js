const problemRouter = require('express').Router()
const { 
    problemPost, 
    problemGetAll,
    problemGetOne,
    problemPatch,
    problemDelete
} = require('../controllers/problemController')
const tokenExtractor = require('../middleware/tokenExtractor')
const userExtractor = require('../middleware/userExtractor')

problemRouter.get('/', problemGetAll)
problemRouter.get('/:slug', problemGetOne)
problemRouter.post('/', tokenExtractor, userExtractor, problemPost)
problemRouter.patch('/:slug', tokenExtractor, userExtractor, problemPatch)
problemRouter.delete('/:slug', tokenExtractor, userExtractor, problemDelete)

module.exports = problemRouter