import { createReducer, createActions } from "reduxsauce"

const { Types, Creators } = createActions({
  createAccount: ["name", "email", "password", "history"],
  getAccount: null,
  getAccountSuccess: ["account"],
  getAccountFailure: null,
  editName: null,
  updateTemporaryName: ["temporaryName"],
  cancelEditName: null,
  updateAccount: ["name"],
  updateAccountSuccess: ["account"],
  updateAccountFailure: null,
  editPassword: null,
  cancelEditPassword: null,
  changePassword: ["currentPassword", "newPassword"],
  changePasswordSuccess: null,
  changePasswordFailure: null,
  changeConfirmDeleteAccount: ["confirmDeleteAccount"],
  deleteAccount: ["history"],
  deleteAccountSuccess: null,
  deleteAccountFailure: null,
  doSocialMigration: ["email", "password", "history"]
})

const INITIAL_STATE = {
  account: {},
  name: "",
  role: "",
  createdAt: "",
  temporaryName: "",
  showEditName: false,
  showEditPassword: false,
  confirmDeleteAccount: false
}

const createAccount = state => state

const getAccount = state => state

const getAccountSuccess = (state, action) => ({
  ...state,
  account: action.account,
  name: action.account.name,
  role: action.account.role,
  createdAt: action.account.createdAt
})

const getAccountFailure = state => state

const editName = state => ({
  ...state,
  showEditName: true,
  temporaryName: state.name
})

const updateTemporaryName = (state, action) => ({
  ...state,
  temporaryName: action.temporaryName
})

const cancelEditName = state => ({
  ...state,
  showEditName: false
})

const updateAccount = state => state

const updateAccountSuccess = (state, action) => ({
  ...state,
  showEditName: false,
  account: action.account,
  name: action.account.name,
  role: action.account.role,
  createdAt: action.account.createdAt
})

const updateAccountFailure = state => state

const editPassword = state => ({
  ...state,
  showEditPassword: true
})

const cancelEditPassword = state => ({
  ...state,
  showEditPassword: false
})

const changePassword = state => state

const changePasswordSuccess = state => ({
  ...state,
  showEditPassword: false
})

const changePasswordFailure = state => ({
  ...state,
  showEditPassword: false
})

const changeConfirmDeleteAccount = (state, action) => ({
  ...state,
  confirmDeleteAccount: action.confirmDeleteAccount
})

const deleteAccount = state => state

const deleteAccountSuccess = state => state

const deleteAccountFailure = state => state

const doSocialMigration = state => state

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_ACCOUNT]: createAccount,
  [Types.GET_ACCOUNT]: getAccount,
  [Types.GET_ACCOUNT_SUCCESS]: getAccountSuccess,
  [Types.GET_ACCOUNT_FAILURE]: getAccountFailure,
  [Types.EDIT_NAME]: editName,
  [Types.UPDATE_TEMPORARY_NAME]: updateTemporaryName,
  [Types.CANCEL_EDIT_NAME]: cancelEditName,
  [Types.UPDATE_ACCOUNT]: updateAccount,
  [Types.UPDATE_ACCOUNT_SUCCESS]: updateAccountSuccess,
  [Types.UPDATE_ACCOUNT_FAILURE]: updateAccountFailure,
  [Types.EDIT_PASSWORD]: editPassword,
  [Types.CANCEL_EDIT_PASSWORD]: cancelEditPassword,
  [Types.CHANGE_PASSWORD]: changePassword,
  [Types.CHANGE_PASSWORD_SUCCESS]: changePasswordSuccess,
  [Types.CHANGE_PASSWORD_FAILURE]: changePasswordFailure,
  [Types.CHANGE_CONFIRM_DELETE_ACCOUNT]: changeConfirmDeleteAccount,
  [Types.DELETE_ACCOUNT]: deleteAccount,
  [Types.DELETE_ACCOUNT_SUCCESS]: deleteAccountSuccess,
  [Types.DELETE_ACCOUNT_FAILURE]: deleteAccountFailure,
  [Types.DO_SOCIAL_MIGRATION]: doSocialMigration
})

export const AccountTypes = Types

export default Creators
