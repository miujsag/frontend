function toList (items, separator = ',') {
  return items ? items.split(separator) : []
}

function getSelectedIds (cookies, items, key) {
  const idsFromCookies = toList(cookies[key], '.')
   .map(id => id ? parseInt(id) : id)

  if (idsFromCookies.length > 0) {
    return idsFromCookies
  } else {
    return items
      .filter(item => item.state === 'selected')
      .map(item => item.id)
  }
}

function setIsSelected (site, selectedIds) {
  site.isSelected = selectedIds.includes(site.id) ? true : false

  return site
}

module.exports = {
  toList,
  setIsSelected,
  getSelectedIds
}
