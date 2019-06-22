function toList (items, separator = ',') {
  return items ? items.split(separator) : []
}

module.exports = {
  toList
}
