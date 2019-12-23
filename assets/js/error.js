const errorContainer = document.querySelector('.error')
const errorText = document.querySelector('.error p')
const defaultErrorText = 'Valami hiba történt. Próbáld újra! <br> Ha továbbra sem működik, <a href="mailto:hello@miujsag.org">kérlek jelezd</a>'

function cleanError () {
  errorContainer.classList.remove = 'active'
}

function renderError (error) {
  errorContainer.classList.add = 'active'

  console.log(error.message)
}
