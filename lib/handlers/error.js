const {logError} = require('logger')

function handleError (error, request, response, next) {
  logError(error)

  response.render('pages/500')
}

module.exports = {
  handleError
}