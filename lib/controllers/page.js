const {Site, Article, Day, Weather, Rate, Category} = require('db')
const {search, createSearchClient} = require('search')
const {setIsSelected, getSelectedIds} = require('./helpers')

const client = createSearchClient(process.env.HOST, process.env.LOG)

async function news (request, response) {
  try {
    const sites = await Site.lists()
    const categories = await Category.lists()
    const selectedSiteIds = getSelectedIds(request.cookies, sites, 'sites')
    const selectedCategoryIds = getSelectedIds(request.cookies, categories, 'categories')

    const [articles, day, weather, rates] = await Promise.all([
      await Article.lists(selectedSiteIds, selectedCategoryIds, new Date(), 20),
      await Day.today(),
      await Weather.getBy({city: 'Budapest'}),
      await Rate.lists(1)
    ])
    
    const sitesWithIsSelected = sites.map(site => setIsSelected(site, selectedSiteIds))
    const categoriesWithIsSelected = categories.map(site => setIsSelected(site, selectedCategoryIds))

    response.render('pages/news', {
      articles,
      day,
      weather,
      rates,
      categories: categoriesWithIsSelected,
      sites: sitesWithIsSelected,
      subheaderActive: true
    })
  } catch (error) {
    console.log({error})
  }
}

async function getSearch (request, response) {
  try {
    const query = request.query.search || ''
    const from = request.query.from
    const until = request.query.until
    
    const [sites, categories, day, weather, rates] = await Promise.all([
      await Site.lists(),
      await Category.lists(),
      await Day.today(),
      await Weather.getBy({city: 'Budapest'}),
      await Rate.lists(1)
    ])
    
    const selectedSiteIds = getSelectedIds(request.cookies, sites, 'sites')
    const selectedCategoryIds = getSelectedIds(request.cookies, categories, 'categories')
    
    const sitesWithIsSelected = sites.map(site => setIsSelected(site, selectedSiteIds))
    const categoriesWithIsSelected = categories.map(site => setIsSelected(site, selectedCategoryIds))

    const {articles, total} = await search(client, query, selectedSiteIds, selectedCategoryIds, from, until)
    const loadMore = total && total.value > 20

    response.render('pages/search', {
      query,
      from,
      until,
      day,
      weather,
      rates,
      articles,
      loadMore,
      categories: categoriesWithIsSelected,
      sites: sitesWithIsSelected
    })
  } catch (error) {
    console.log({error})
  }
}

module.exports = {
  news,
  search: getSearch
}
