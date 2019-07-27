const searchModal = document.querySelector('.search-modal')
const searchCloseButton = document.querySelector('.search-close')

export function openSearch () {
  searchModal.classList.add('active')
}

function closeSearch () {
  searchModal.classList.remove('active')
}

searchCloseButton.addEventListener('click', closeSearch)
