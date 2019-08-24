const errorContainer = document.querySelector('.error')
const errorText = document.querySelector('.error p')
const defaultErrorText = 'Valami hiba történt. Kérlek próbáld újra! <br> Ha továbbra sem működik, <a href="mailto:hello@miujsag.org">kérlek jelezd</a>'

function cleanError () {
  errorContainer.style.display = 'none'
}

function renderError (error, message) {
  errorContainer.style.display = 'block'
  errorText.innerHTML = message

  console.log(error.message)
}
