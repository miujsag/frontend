import css from "../css/app.css"
import {setCookie} from './cookie'
import {getCheckedValues} from './form'
import {getCategoryCheckboxes, categoryCheckboxesOnChange} from './header'
import {getSiteCheckboxes, siteCheckboxesOnChange} from './sidebar'
import {renderArticles, loadMoreButtonOnClick, getLastArticlesDateTime, getArticlesLength, renderLoadMoreButton} from './article'

/* NEWS */

function updateArticles (_event, isLoadMore = false) {
  const siteIds = getCheckedValues(getSiteCheckboxes())
  const categoryIds = getCheckedValues(getCategoryCheckboxes())

  setCookie('sites', siteIds)
  setCookie('categories', categoryIds)
  
  const until = isLoadMore ? getLastArticlesDateTime() : ''
  
  fetch(`/api/articles?sites=${siteIds.join(',')}&categories=${categoryIds.join(',')}&until=${until}`)
    .then(response => response.json())
    .then(({articles}) => renderArticles(articles, isLoadMore))
    .catch(renderError)
}

function loadMoreArticles () {
  updateArticles(null, true)
}

/* SEARCH */
import flatpickr from 'flatpickr'
import { Hungarian } from 'flatpickr/dist/l10n/hu.js'
import '../../node_modules/flatpickr/dist/flatpickr.min.css'
flatpickr('.search-box input[name="from"]', {locale: Hungarian})
flatpickr('.search-box input[name="until"]', {locale: Hungarian})
flatpickr('.search-modal input[name="from"]', {locale: Hungarian})
flatpickr('.search-modal input[name="until"]', {locale: Hungarian})

const searchForm = document.querySelector('.search-box')
const searchInput = document.querySelector('.search-box input[name="search"')
const fromInput = document.querySelector('.search-box input[name="from"]')
const untilInput = document.querySelector('.search-box input[name="until"]')


function search (event, isLoadMore = false, skip = 0) {
  if (event) {
    event.preventDefault()
  }

  const query = searchInput.value
  const from = fromInput.value
  const until = untilInput.value
  const siteIds = getCheckedValues(getSiteCheckboxes())
  const categoryIds = getCheckedValues(getCategoryCheckboxes())

  setCookie('sites', siteIds)
  setCookie('categories', categoryIds)

  fetch(`/api/articles/search?query=${query}&sites=${siteIds.join(',')}&categories=${categoryIds.join(',')}&skip=${skip}&from=${from}&until=${until}`)
    .then(response => response.json())
    .then(({articles, isMore}) => {
      renderArticles(articles, isLoadMore)
      renderLoadMoreButton(isMore)
    })
    .catch(renderError)
}

function loadMoreSearchResults () {
  const articlesLength = getArticlesLength()
  search(null, true, articlesLength)
}

function renderError (error) {
  console.log(error.message)
}

/* EVENTS */
if (document.querySelector('.search-box')) {
  siteCheckboxesOnChange(search)
  categoryCheckboxesOnChange(search)
  loadMoreButtonOnClick(loadMoreSearchResults)

  searchForm.addEventListener('submit', search)
} else {
  siteCheckboxesOnChange(updateArticles)
  categoryCheckboxesOnChange(updateArticles)
  loadMoreButtonOnClick(loadMoreArticles)
}

