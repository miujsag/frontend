export function getCheckedValues (inputs) {
  return inputs
    .filter(input => input.checked)
    .map(input => input.value)
}

export function convertValuesToParams (values) {

}

function checkboxesToParams (name, checkboxes) {
  const values = checkboxes
    .filter(input => input.checked)
    .map(input => input.value)
  
  return `${name}=${values.join(',')}`
}
