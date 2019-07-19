const {Article} = require('db')
const {search, createSearchClient} = require('search')
const {toList} = require('./helpers')

const client = createSearchClient(process.env.HOST, process.env.LOG)

function index (request, response) {
  const siteIds = toList(request.query.sites)
  const categoryIds = toList(request.query.categories)
  const till = request.query.till || new Date()

  Article
    .lists(siteIds, categoryIds, till, 20)
    .then(articles => response.json({articles}))
    .catch(error => response.json({error}))
}

function searchArticles (request, response) {
  const query = request.query.query || ''
  const siteIds = toList(request.query.sites)
  const categoryIds = toList(request.query.categories)
  const from = request.query.from
  const until = request.query.until
  const skip = request.query.skip

  search(client, query, siteIds, categoryIds, from, until, skip)
    .then(articles => response.json(articles))
    .catch(error => response.json(error))
}

module.exports = {
  index,
  search: searchArticles
}
