const {
  format,
  addMonths
} = require('date-fns')

function getCurrentDate () {
  return format(new Date(), 'YYYY-MM-DD')
}

function getLastMonthsDate () {
  return format(addMonths(new Date(), - 1), 'YYYY-MM-DD')
}

function getYear (date) {
  return format(date, 'YYYY')
}

function getMonth (date) {
  return format(date, 'MM')
}

function getDay (date) {
  return format(date, 'DD')
}

module.exports = {
  getCurrentDate,
  getLastMonthsDate,
  getYear,
  getMonth,
  getDay
}
