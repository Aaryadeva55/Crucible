const router = require('express').Router()
const {
    root
} = require('../controllers/rootController')

router.get('/', root);

module.exports = router