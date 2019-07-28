import {getCookie, setCookie} from './cookie'
import {getCheckedValues} from './form'

const siteCheckboxes = Array.from(document.querySelectorAll('.site input'))
const sidebar = document.querySelector('aside')
const main = document.querySelector('main')
const sidebarButton = document.querySelector('.aside-toggle')
const closeButton = document.querySelector('.close-button')
const mobileCategoryCheckboxes = Array.from(document.querySelectorAll('aside .category input'))
const categoryCheckboxes = Array.from(document.querySelectorAll('.sub-header .category input'))
const toggleSelectAllButton = document.querySelector('.toggle-select-all')

export function closeMobileSidebar () {
  sidebar.classList.remove('mobile-active')
}

export function openMobileSidebar () {
  sidebar.classList.add('mobile-active')
}

export function getSiteCheckboxes () {
  return siteCheckboxes
}

export function siteCheckboxesOnChange(eventHandler) {
  siteCheckboxes.forEach(checkbox => checkbox.addEventListener('change', eventHandler))
}

export function mobileCategoryCheckboxesOnChange (eventHandler) {
  mobileCategoryCheckboxes.forEach(checkbox => checkbox.addEventListener('change', eventHandler))
}

function toggleSelectAll () {
  const isAllSelected = siteCheckboxes.every(checkbox => checkbox.checked)

  if (isAllSelected) {
    siteCheckboxes.forEach(checkbox => checkbox.checked = false)
    toggleSelectAllButton.classList.remove('active')
  } else {
    siteCheckboxes.forEach(checkbox => checkbox.checked = true)
    toggleSelectAllButton.classList.add('active')
  }

  siteCheckboxes[0].dispatchEvent(new Event('change'))
}

function toggleSidebar () {
  sidebar.classList.toggle('active')
  main.classList.toggle('active')
}

function changeCategoryCheckbox () {
  const pair = categoryCheckboxes.find(checkbox => checkbox.value === event.target.value)

  pair.checked = !pair.checked
  pair.dispatchEvent(new Event('change'))
}

if (!getCookie('sites')) {
  const selectedSites = getCheckedValues(siteCheckboxes)

  setCookie('sites', selectedSites)
}

closeButton.addEventListener('click', closeMobileSidebar)
sidebarButton.addEventListener('click', toggleSidebar)
mobileCategoryCheckboxes.forEach(checkbox => checkbox.addEventListener('change', changeCategoryCheckbox))
toggleSelectAllButton.addEventListener('click', toggleSelectAll)
