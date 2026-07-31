const problemRouter = require('express').Router()
const { 
    problemPost, 
    problemGetAll,
    problemGetOne,
    problemPatch,
    problemDelete,
    problemPublish,
    problemUnpublish
} = require('../controllers/problemController')
const tokenExtractor = require('../middleware/tokenExtractor')
const userExtractor = require('../middleware/userExtractor')
const adminOnly = require('../middleware/adminOnly')

problemRouter.get('/', problemGetAll)
problemRouter.get('/:slug', problemGetOne)
problemRouter.post('/', tokenExtractor, userExtractor, problemPost)
problemRouter.patch('/:slug', tokenExtractor, userExtractor, problemPatch)
problemRouter.delete('/:slug', tokenExtractor, userExtractor, problemDelete)
problemRouter.patch('/:slug/publish', tokenExtractor, userExtractor, adminOnly, problemPublish)
problemRouter.patch('/:slug/unpublish', tokenExtractor, userExtractor, adminOnly, problemUnpublish)

module.exports = problemRouter