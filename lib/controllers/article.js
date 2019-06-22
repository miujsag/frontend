const {Article} = require('db')
const {toList} = require('./helpers')

function index (request, response) {
  const siteIds = toList(request.query.sites)
  const till = request.query.till || new Date()

  Article
    .lists(siteIds, till, 20)
    .then(articles => response.json({articles}))
    .catch(error => response.json({error}))
}

module.exports = {
  index
}
