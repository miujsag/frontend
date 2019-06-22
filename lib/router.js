const express = require('express')

const articleController = require('./controllers/article')
const pageController = require('./controllers/page')

const router = express.Router()

router.get('/', pageController.index)
router.get('/api/articles', articleController.index)

module.exports = router
