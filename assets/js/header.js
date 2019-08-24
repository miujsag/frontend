import {getCookie, setCookie} from './cookie'
import {getCheckedValues} from './form'
import {openMobileSidebar} from './sidebar'
import {openSearch} from './search'

const menuButton = document.querySelector('.menu-button')
const searchButton = document.querySelector('.mobile-search-button')
const toggleCategoriesButton = document.querySelector('.toggle-categories')
const categoryCheckboxes = Array.from(document.querySelectorAll('.sub-header .category input'))
const mobileCategoryCheckboxes = Array.from(document.querySelectorAll('aside .category input'))

export function getCategoryCheckboxes () {
  return categoryCheckboxes
}

export function categoryCheckboxesOnChange(eventHandler) {
  categoryCheckboxes.forEach(checkbox => checkbox.addEventListener('change', eventHandler))
}

export function menuButtonOnClick () {
  return menuButton.addEventListener('click', openMobileSidebar)
}

function changeMobileCategoryCheckbox () {
  categoryCheckboxes.forEach((checkbox, index) => {
    mobileCategoryCheckboxes[index].checked = checkbox.checked
  })
}

function toggleSelectAllCategories () {
  const isAllSelected = categoryCheckboxes.every(checkbox => checkbox.checked)

  if (isAllSelected) {
    categoryCheckboxes.forEach(checkbox => checkbox.checked = false)
    toggleCategoriesButton.classList.remove('active')
  } else {
    categoryCheckboxes.forEach(checkbox => checkbox.checked = true)
    toggleCategoriesButton.classList.add('active')
  }

  siteCheckboxes[0].dispatchEvent(new Event('change'))
}

if (!getCookie('categories')) {
  const selectedCategories = getCheckedValues(categoryCheckboxes)

  setCookie('categories', selectedCategories)
}

menuButton.addEventListener('click', openMobileSidebar)
searchButton.addEventListener('click', openSearch)
toggleCategoriesButton.addEventListener('click', toggleSelectAllCategories)
categoryCheckboxes.forEach(checkbox => checkbox.addEventListener('change', changeMobileCategoryCheckbox))
