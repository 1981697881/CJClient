import Cookies from 'js-cookie'

const TokenKey = 'clrx'

export function getToken(TokenKey) {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
  // return Cookies.set(TokenKey, token)
}
export function getPer(clper) {
  return Cookies.get(clper)
}

export function setPer(clper) {
  return Cookies.set('clper', clper)
  // return Cookies.set(TokenKey, token)
}

export function removeToken(TokenKey) {
  return Cookies.remove(TokenKey)
}

export function setUserName(username){
  return Cookies.set('clun',username)
}
export function setPassword(password){
  return Cookies.set('clps',password)
}
