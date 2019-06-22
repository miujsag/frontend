const {Site, Article, Day, Weather, Rate, Category} = require('db')
const {toList} = require('./helpers')

async function index (request, response) {
  try {
    const sites = await Site.lists()
    const categories = await Category.lists()
    const selectedSiteIds = getSelectedSiteIds(request.cookies, sites)
    const [articles, day, weather, rates] = await Promise.all([
      await Article.lists(selectedSiteIds, new Date(), 20),
      await Day.today(),
      await Weather.getBy({city: 'Budapest'}),
      await Rate.lists(1)
    ])
    
    const sitesWithIsSelected = sites.map(site => setIsSelected(site, selectedSiteIds))

    response.render('pages/index', {
      articles,
      day,
      weather,
      rates,
      categories,
      sites: sitesWithIsSelected
    })
  } catch (error) {
    console.log({error})
  }
}

function getSelectedSiteIds (cookies, sites) {
  const siteIdsFromCookies = toList(cookies.sites, '.')
   .map(id => id ? parseInt(id) : id)

  if (siteIdsFromCookies.length > 0) {
    return siteIdsFromCookies
  } else {
    return sites
      .filter(site => site.state === 'selected')
      .map(site => site.id)
  }
}

function setIsSelected (site, selectedIds) {
  site.isSelected = selectedIds.includes(site.id) ? true : false

  return site
}

module.exports = {
  index
}
