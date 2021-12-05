import { createReducer, createActions } from "reduxsauce"

const { Types, Creators } = createActions({
  resetPasswordStart: ["email"],
  resetPasswordStartSuccess: ["email", "duration"],
  resetPasswordStartFailure: null,
  resetPasswordComplete: ["token", "password", "history"],
  resetPasswordCompleteSuccess: null,
  resetPasswordCompleteFailure: null
})

const INITIAL_STATE = {
  email: null,
  error: null,
  forgotSuccess: false
}

const resetPasswordStart = state => ({
  ...state,
  forgotSuccess: false
})

const resetPasswordStartSuccess = (state, action) => ({
  ...state,
  email: action.email,
  duration: action.duration,
  forgotSuccess: true
})

const resetPasswordStartFailure = (state, action) => ({
  ...state,
  error: action.error
})

const resetPasswordComplete = state => state

const resetPasswordCompleteSuccess = state => state

const resetPasswordCompleteFailure = state => state

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RESET_PASSWORD_START]: resetPasswordStart,
  [Types.RESET_PASSWORD_START_SUCCESS]: resetPasswordStartSuccess,
  [Types.RESET_PASSWORD_START_FAILURE]: resetPasswordStartFailure,
  [Types.RESET_PASSWORD_COMPLETE]: resetPasswordComplete,
  [Types.RESET_PASSWORD_COMPLETE_SUCCESS]: resetPasswordCompleteSuccess,
  [Types.RESET_PASSWORD_COMPLETE_FAILURE]: resetPasswordCompleteFailure
})

export const ResetPasswordTypes = Types

export default Creators
