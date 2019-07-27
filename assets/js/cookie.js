export function getCookie (name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  
  if (match) {
    return match[2]
  }
}

export function setCookie (name, value) {
  const cookieValue = value instanceof Array ? value.join('.') : value
  
  document.cookie = `${name}=${cookieValue}`
}
