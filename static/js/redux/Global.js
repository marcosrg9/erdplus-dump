import { createReducer, createActions } from "reduxsauce"

const { Types, Creators } = createActions({
  setBusy: null,
  clearBusy: null,
  showToast: ["message"],
  hideToast: null
})

const INITIAL_STATE = {
  busy: false,
  toast: false,
  toastMessage: ""
}

const setBusy = state => {
  return {
    ...state,
    busy: true
  }
}

const clearBusy = state => ({
  ...state,
  busy: false
})

const showToast = (state, action) => ({
  ...state,
  toast: true,
  toastMessage: action.message
})

const hideToast = state => ({
  ...state,
  toast: false
})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_BUSY]: setBusy,
  [Types.CLEAR_BUSY]: clearBusy,
  [Types.SHOW_TOAST]: showToast,
  [Types.HIDE_TOAST]: hideToast
})

export const GlobalTypes = Types

export default Creators
