const {
  format,
  distanceInWordsStrict,
  getMinutes,
  differenceInHours,
  differenceInDays,
  isYesterday,
  differenceInMonths
} = require('date-fns')
const hu = require('date-fns/locale/hu')

function truncate (text) {
  return !text || text.length < 230 ? text : text.substring(0, 230) + '...'
}

function convertToMinutes (time) {
  if (!time) return ''

  const timeToMinutes = getMinutes(time)

  if (timeToMinutes === 0) return 'kevesebb, mint egy perc'

  return `${timeToMinutes} perc`
}

function formatDatetime (time) {
  if (!time) return ''

  if (differenceInMonths(new Date(), time) > 0) {
    return format(time, 'YYYY MMMM DD', {locale: hu})
  } else if (isYesterday(time) || differenceInDays(new Date(), time) > 0) {
    return format(time, 'MMMM DD', {locale: hu})
  } else if (differenceInHours(new Date(), time) > 0) {
    return format(time, 'HH:mm', {locale: hu})
  } else {
    return distanceInWordsStrict(new Date(), time, {locale: hu})
  }
}

module.exports = {
  truncate,
  convertToMinutes,
  formatDatetime
}
