const {Article} = require('db')
const {search, createSearchClient} = require('search')
const {createLogMessage} = require('logger')
const {toList} = require('./helpers')

const client = createSearchClient(process.env.HOST, process.env.LOG)

async function index (request, response, next) {
  try {
    const siteIds = toList(request.query.sites)
    const categoryIds = toList(request.query.categories)
    const until = request.query.until || new Date()
    
    const [articles, count] = await Promise.all([
      Article.lists(siteIds, categoryIds, until, 20),
      Article.count(siteIds, categoryIds)
    ])

    const isMore = count > 20
    
    response.json({
      isMore,
      articles
    })
  } catch (error) {
    next(new Error(createLogMessage({
      page: 'api/index',
      error: error.message
    })))
  }
}

function searchArticles (request, response, next) {
  const query = request.query.query || ''
  const siteIds = toList(request.query.sites)
  const categoryIds = toList(request.query.categories)
  const from = request.query.from
  const until = request.query.until
  const skip = request.query.skip
  const sort = request.query.sort

  search(client, query, siteIds, categoryIds, from, until, skip, sort)
    .then(({articles, total}) => {
      const isMore = total && total.value > parseInt(skip) + 20

      response.json({articles, isMore})
    })
    .catch(error => {
      next(new Error(createLogMessage({
        resource: 'search',
        error: error.message
      })))
    })
}

module.exports = {
  index,
  search: searchArticles
}
