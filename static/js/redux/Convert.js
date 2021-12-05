import { createReducer, createActions } from "reduxsauce"

// Actions related to
// - converting ER to Relational
// - generating SQL

const { Types, Creators } = createActions({
  showConvertToRelationalDialog: ["diagramId", "name"],
  hideConvertToRelationalDialog: null,
  convertToRelational: ["folderId", "name", "content", "edit", "history"],
  nameChanged: ["name"],
  generateSql: ["content"],
  generateSqlSuccess: ["sql"],
  generateSqlFailure: null,
  hideConvertSqlDialog: null,
  setSqlCopied: null
})

const INITIAL_STATE = {
  showDialog: false,
  autoFocusName: false,
  diagramId: 0,
  name: "",
  sql: "",
  showConvertSqlDialog: false,
  sqlCopied: false
}

const showConvertToRelationalDialog = (state, action) => ({
  ...state,
  showDialog: true,
  autoFocusName: true,
  diagramId: action.diagramId,
  name: action.name
})

const hideConvertToRelationalDialog = state => ({
  ...state,
  showDialog: false,
  autoFocusName: false
})

const convertToRelational = state => state

const nameChanged = (state, action) => ({
  ...state,
  name: action.name,
  autoFocusName: false
})

const generateSql = state => state

const generateSqlSuccess = (state, action) => ({
  ...state,
  showConvertSqlDialog: true,
  sqlCopied: false,
  sql: action.sql
})

const generateSqlFailure = (state, action) => ({
  ...state,
  showConvertSqlDialog: true,
  sql: "Error"
})

const hideConvertSqlDialog = (state, action) => ({
  ...state,
  showConvertSqlDialog: false,
  sql: ""
})

const setSqlCopied = state => ({
  ...state,
  sqlCopied: true
})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SHOW_CONVERT_TO_RELATIONAL_DIALOG]: showConvertToRelationalDialog,
  [Types.HIDE_CONVERT_TO_RELATIONAL_DIALOG]: hideConvertToRelationalDialog,
  [Types.CONVERT_TO_RELATIONAL]: convertToRelational,
  [Types.NAME_CHANGED]: nameChanged,
  [Types.GENERATE_SQL]: generateSql,
  [Types.GENERATE_SQL_SUCCESS]: generateSqlSuccess,
  [Types.GENERATE_SQL_FAILURE]: generateSqlFailure,
  [Types.HIDE_CONVERT_SQL_DIALOG]: hideConvertSqlDialog,
  [Types.SET_SQL_COPIED]: setSqlCopied
})

export const ConvertTypes = Types

export default Creators
