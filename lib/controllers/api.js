const {Article} = require('db')
const {search, createSearchClient} = require('search')
const {toList} = require('./helpers')

const client = createSearchClient(process.env.HOST, process.env.LOG)

function index (request, response) {
  const siteIds = toList(request.query.sites)
  const categoryIds = toList(request.query.categories)
  const until = request.query.until || new Date()
  
  Article
    .lists(siteIds, categoryIds, until, 20)
    .then(({count, rows}) => {
      const isMore = count > 20
      
      response.json({
        isMore,
        articles: rows
      })
    })
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
    .then(({articles, total}) => {
      const isMore = total && total.value > parseInt(skip) + 20

      response.json({articles, isMore})
    })
    .catch(error => response.json(error))
}

module.exports = {
  index,
  search: searchArticles
}
