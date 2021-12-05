import jwtDecode from "jwt-decode"

export const API_TOKEN = "ApiToken"

export const getApiToken = () => {
  return window.localStorage.getItem(API_TOKEN)
}

export const setApiToken = token => {
  window.localStorage.setItem(API_TOKEN, token)
}

export const resetApiToken = () => {
  window.localStorage.removeItem(API_TOKEN)
}

export const isLoggedIn = () => !!getApiToken()

export const tryDecode = token => {
  // If decoding fails, reset the token.
  try {
    if (token) {
      return jwtDecode(token)
    }
    return null
  } catch (e) {
    resetApiToken()
    return null
  }
}
