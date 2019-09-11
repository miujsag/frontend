const {Site, Article, Day, Weather, Rate, Category} = require('db')
const {search, createSearchClient} = require('search')
const {setIsSelected, getSelectedIds} = require('./helpers')
const {createLogMessage, logInfo} = require('logger')

const client = createSearchClient(process.env.HOST, process.env.LOG)

async function news (request, response, next) {
  try {
    const sites = await Site.lists()
    const categories = await Category.lists()
    const selectedSiteIds = getSelectedIds(request.cookies, sites, 'sites')
    const selectedCategoryIds = getSelectedIds(request.cookies, categories, 'categories')

    const [articles, count, day, weather, rates] = await Promise.all([
      Article.lists(selectedSiteIds, selectedCategoryIds, new Date(), 60),
      Article.count(selectedSiteIds, selectedCategoryIds),
      Day.today(),
      Weather.getBy({city: 'Budapest'}),
      Rate.lists(1)
    ])

    const isMore = count > 20

    const sitesWithIsSelected = sites.map(site => setIsSelected(site, selectedSiteIds))
    const categoriesWithIsSelected = categories.map(site => setIsSelected(site, selectedCategoryIds))

    response.render('pages/news', {
      day,
      weather,
      rates,
      isMore,
      articles,
      count,
      categories: categoriesWithIsSelected,
      sites: sitesWithIsSelected,
      subheaderActive: true
    })
  } catch (error) {
    next(new Error(createLogMessage({
      page: 'news',
      error: error.message
    })))
  }
}

async function getSearch (request, response, next) {
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
    next(new Error(createLogMessage({
      page: 'search',
      error: error.message
    })))
  }
}

async function notFound(request, response, next) {
  try {
    const sites = await Site.lists()
    const categories = await Category.lists()
    const selectedSiteIds = getSelectedIds(request.cookies, sites, 'sites')
    const selectedCategoryIds = getSelectedIds(request.cookies, categories, 'categories')

    const [day, weather, rates] = await Promise.all([
      await Day.today(),
      await Weather.getBy({city: 'Budapest'}),
      await Rate.lists(1)
    ])

    const sitesWithIsSelected = sites.map(site => setIsSelected(site, selectedSiteIds))
    const categoriesWithIsSelected = categories.map(site => setIsSelected(site, selectedCategoryIds))

    response.render('pages/404', {
      day,
      weather,
      rates,
      categories: categoriesWithIsSelected,
      sites: sitesWithIsSelected,
      subheaderActive: true
    })
  } catch (error) {
    next(new Error(createLogMessage({
      page: '404',
      error: error.message
    })))
  }
}

module.exports = {
  news,
  notFound,
  search: getSearch
}
