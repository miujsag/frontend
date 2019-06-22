const hbs = require('hbs')
const {format} = require('date-fns')
const hu = require('date-fns/locale/hu')
const {truncate, convertToMinutes, formatDatetime} = require('./articles')

function round (number) {
  return number ? Math.round(number) : ''
}

function getToday () {
  return format(new Date(), 'YYYY.MM.DD. dddd', {locale: hu})
}

function isSelected (isSelected, options) {
  return isSelected ? options.fn(this) : options.inverse(this)
}

function toISOString (datetime) {
  return new Date(datetime).toISOString()
}


module.exports = function() {
  hbs.registerHelper('round', round)
  hbs.registerHelper('today', getToday)
  hbs.registerHelper('truncate', truncate)
  hbs.registerHelper('getToday', getToday)
  hbs.registerHelper('isSelected', isSelected)
  hbs.registerHelper('toISOString', toISOString)
  hbs.registerHelper('convertToMinutes', convertToMinutes)
  hbs.registerHelper('formatDatetime', formatDatetime)
}
