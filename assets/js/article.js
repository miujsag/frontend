import {truncate, convertToMinutes, formatDatetime} from '../../lib/views/helpers/articles'

const articleList = document.querySelector('.articles')
const loadMoreButton = document.querySelector('.load-more')

function renderHighlightsOrDescription (article) {
  console.log(article.highlights)
  if (article.highlights) {
    return article.highlights
      .map(highlight => `<p class="highlight">${highlight}</p>`)
      .join('')
  } else {
    return `<p>${truncate(article.description)}</p>`
  }
} 

export function renderArticles (articles, isLoadMore) {
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
        ${renderHighlightsOrDescription(article)}
      </div>
      <footer>
      ${renderEstimatedReadTime(article.estimatedReadTime)}
      </footer>
    `

    articleList.appendChild(articleElement)
  })
}

export function renderEstimatedReadTime (estimatedReadTime) {
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

export function renderLoadMoreButton (isMore) {
  if (isMore) {
    loadMoreButton.style.display = 'block'
  } else {
    loadMoreButton.style.display = 'none'
  }
}

export function getLastArticlesDateTime () {
  const lastArticle = document.querySelector('.article:last-of-type time')

  return lastArticle ? lastArticle.getAttribute('datetime') : new Date()
}

export function getArticlesLength () {
  return articleList.children.length
}

export function loadMoreButtonOnClick (eventHandler) {
  return loadMoreButton.addEventListener('click', eventHandler)
}
