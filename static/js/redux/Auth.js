import { createReducer, createActions } from "reduxsauce"

const { Types, Creators } = createActions({
  login: ["email", "password", "history"],
  loginSuccess: ["session"],
  loginFailure: null,
  logout: ["history"],
  logoutSuccess: null,
  verifyToken: ["history"],
  verifyTokenSuccess: ["session"],
  verifyTokenFailure: null,
  googleLogin: ["idToken", "history"],
  setShowSocialMigrationWarning: ["show"]
})

const INITIAL_STATE = {
  verifyTokenComplete: false,
  isLoggedIn: false,
  session: {},
  showSocialMigrationWarning: false
}

const login = state => state

const loginSuccess = (state, action) => {
  return {
    ...state,
    session: action.session,
    isLoggedIn: true
  }
}

const loginFailure = state => state

const logout = state => state

const logoutSuccess = state => ({
  ...state,
  isLoggedIn: false,
  session: {},
  showSocialMigrationWarning: false
})

const verifyToken = state => state

const verifyTokenSuccess = (state, action) => {
  return {
    ...state,
    session: action.session,
    isLoggedIn: true,
    verifyTokenComplete: true
  }
}

const verifyTokenFailure = state => ({
  ...state,
  isLoggedIn: false,
  verifyTokenComplete: true,
  showSocialMigrationWarning: false
})

const googleLogin = state => state

const setShowSocialMigrationWarning = (state, action) => {
  return {
    ...state,
    showSocialMigrationWarning: action.show
  }
}

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN]: login,
  [Types.LOGIN_SUCCESS]: loginSuccess,
  [Types.LOGIN_FAILURE]: loginFailure,
  [Types.LOGOUT]: logout,
  [Types.LOGOUT_SUCCESS]: logoutSuccess,
  [Types.VERIFY_TOKEN]: verifyToken,
  [Types.VERIFY_TOKEN_SUCCESS]: verifyTokenSuccess,
  [Types.VERIFY_TOKEN_FAILURE]: verifyTokenFailure,
  [Types.GOOGLE_LOGIN]: googleLogin,
  [Types.SET_SHOW_SOCIAL_MIGRATION_WARNING]: setShowSocialMigrationWarning
})

export const AuthTypes = Types

export default Creators
