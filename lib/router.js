const express = require('express')

const articleController = require('./controllers/api')
const pageController = require('./controllers/page')

const router = express.Router()

// WEB

router.get('/', pageController.news)
router.get('/kereses', pageController.search)
router.get('/404', pageController.notFound)

// API
router.get('/api/articles', articleController.index)
router.get('/api/articles/search', articleController.search)

module.exports = router
