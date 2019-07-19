import css from "../css/app.css"
const {truncate, convertToMinutes, formatDatetime} = require('../../lib/views/helpers/articles')
import flatpickr from 'flatpickr'
import { Hungarian } from 'flatpickr/dist/l10n/hu.js'
import '../../node_modules/flatpickr/dist/flatpickr.min.css'
import pikaday from 'pikaday'

const articleList = document.querySelector('.articles')
const siteCheckboxes = Array.from(document.querySelectorAll('.site input'))
const categoryCheckboxes = Array.from(document.querySelectorAll('.sub-header .category input'))
const loadMoreButton = document.querySelector('.load-more')
const menuButton = document.querySelector('.menu-button')
const sidebarCloseButton = document.querySelector('aside .close-button')
const sidebar = document.querySelector('aside')
const searchForm = document.querySelector('.search-form')
const searchInput = document.querySelector('.search-form input[type="search"')

flatpickr("#date-from", {
  locale: Hungarian
})
flatpickr("#date-to", {
  locale: Hungarian
})

function getSelected (type, checkboxes) {
  const selectedFromCookies = getCookie(type)

  if (!selectedFromCookies) {
    const selectedItems = checkboxesToParams(type, checkboxes)
    document.cookie = selectedItems.split(',').join('.')
  }
}

function getCookie (name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  
  if (match) {
    return match[2]
  }
}

function checkboxesToParams (name, checkboxes) {
    const ids = checkboxes
      .filter(input => input.checked)
      .map(input => input.value)
    
    return `${name}=${ids.join(',')}`
}

function updateArticles (_event, isLoadMore = false) {
  const siteParams = checkboxesToParams('sites', siteCheckboxes)
  const categoryParams = checkboxesToParams('categories', categoryCheckboxes)
  const lastArticle = document.querySelector('.article:last-of-type time')
  const lastArticlesDateTime = lastArticle ? lastArticle.getAttribute('datetime') : new Date()

  document.cookie = siteParams.split(',').join('.')
  document.cookie = categoryParams.split(',').join('.')

  const till = isLoadMore ? lastArticlesDateTime : ''
  
  fetch(`/api/articles?${siteParams}&${categoryParams}&till=${till}`)
    .then(response => response.json())
    .then(articles => renderArticles(articles, isLoadMore))
    .catch(renderError)
}

function search (event, isLoadMore = false) {
  const {value} = searchInput
  const siteParams = checkboxesToParams('sites', siteCheckboxes)
  const categoryParams = checkboxesToParams('categories', categoryCheckboxes)

  fetch(`/api/articles/search?query=${value}&${siteParams}&${categoryParams}`)
    .then(response => response.json())
    .then(articles => {
      console.log(articles)
      renderArticles(articles, isLoadMore)
    })
    .catch(renderError)
}

function renderArticles ({articles}, isLoadMore) {
  if (!isLoadMore) {
    articleList.innerHTML = ''
  }

  articles.map(article => {
    const articleElement = document.createElement('li')
    articleElement.classList.add('article')
    articleElement.innerHTML = `
      <header class="inline">
          <time datetime="${article.publishedAt}">
            ${formatDatetime(article.publishedAt)}
          </time>        
          <a href="#">
            <img class="logo-${article.site.slug}" src="images/sites/${article.site.slug}.png" alt="${article.site.name} logó" />
          </a>
      </header>
      <div class="article-body">
        <h2>
          <a href=${article.url} target="_blank" rel="noopener">
            ${article.title}
          </a>
        </h2>
        <p>${truncate(article.description)}</p>
      </div>
      <footer>
      ${renderEstimatedReadTime(article.estimatedReadTime)}
      </footer>
    `

    articleList.appendChild(articleElement)
  })
}

function renderEstimatedReadTime (estimatedReadTime) {
  if (estimatedReadTime) {
    return `
      <span class="estimated-read-time">
        <svg width="14" height="14" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Shape</title><desc>Created using Figma</desc><g transform="translate(-246 -1122)"><path fill="#FFF" d="M246 1122h14v14h-14z"/><clipPath id="a" clip-rule="evenodd"><path d="M-9-32h1480v1600H-9V-32z" fill="#FFF"/></clipPath><g clip-path="url(#a)"><use xlink:href="#b" transform="translate(-9 -32)" fill="transparent"/><use xlink:href="#d" transform="translate(221 828)" fill="#FFF" filter="url(#c)"/><use xlink:href="#e" transform="translate(246 1122)" fill="#132054"/></g></g><defs><filter id="c" filterUnits="userSpaceOnUse" x="217" y="826" width="298" height="337" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="2"/><feColorMatrix values="0 0 0 0 0.301924 0 0 0 0 0.301924 0 0 0 0 0.301924 0 0 0 0.1 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter><path id="b" fill-rule="evenodd" d="M0 0h1480v2056H0V0z"/><path id="d" fill-rule="evenodd" d="M0 6c0-3.314 2.686-6 6-6h278c3.314 0 6 2.686 6 6v317c0 3.314-2.686 6-6 6H6c-3.314 0-6-2.686-6-6V6z"/><path id="e" fill-rule="evenodd" d="M7 0C3.15 0 0 3.15 0 7s3.15 7 7 7 7-3.15 7-7-3.15-7-7-7zm0 12.6c-3.08 0-5.6-2.52-5.6-5.6 0-3.08 2.52-5.6 5.6-5.6 3.08 0 5.6 2.52 5.6 5.6 0 3.08-2.52 5.6-5.6 5.6zm.35-9.1H6.3v4.2l3.64 2.24.56-.91-3.15-1.89V3.5z"/></defs></svg>
        ${convertToMinutes(estimatedReadTime)}
      </span>`
  } else {
    return ''
  }
}

function renderError (error) {
  console.log(error.message)
}

function toggleMenu () {
  sidebar.classList.toggle('active')
}

getSelected('sites', siteCheckboxes)
getSelected('categories', categoryCheckboxes)

siteCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateArticles))
categoryCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateArticles))
loadMoreButton.addEventListener('click', event => updateArticles(event, true))
menuButton.addEventListener('click', toggleMenu)
sidebarCloseButton.addEventListener('click', toggleMenu)
/* searchForm.addEventListener('submit', search) */
