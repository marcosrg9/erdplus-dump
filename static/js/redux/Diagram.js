import { createReducer, createActions } from "reduxsauce"

const { Types, Creators } = createActions({
  getDiagrams: null,
  getDiagramsSuccess: ["diagrams"],
  getDiagramsFailure: null,
  saveDiagram: ["diagram"],
  saveDiagramSuccess: ["diagram"],
  saveDiagramFailure: null,
  createDiagram: ["diagram"],
  createDiagramSuccess: ["diagram"],
  createDiagramFailure: null,
  createDiagramDialogShow: null,
  setCreateDiagramName: ["name"],
  setCreateDiagramType: ["typ"],
  createDiagramDialogCancel: null,
  renameDiagramDialogShow: ["diagram"],
  renameDiagramDialogCancel: null,
  renameDiagramNameChanged: ["name"],
  importDiagramDialogShow: null,
  importDiagramDialogCancel: null,
  dropImportFile: ["file", "currentFolderId"],
  dropImportFileSuccess: ["fileResult"],
  dropImportFileFailure: ["fileResult"],
  removeImportFile: ["index"],
  importDiagrams: ["diagrams"],
  importDiagramsSuccess: ["diagrams"],
  importDiagramsFailure: null,
  deleteDiagram: ["diagramId"],
  deleteDiagramSuccess: null,
  deleteDiagramFailure: null,
  moveToFolderDialogShow: null,
  moveToFolderDialogCancel: null,
  saveManyDiagrams: ["diagrams"],
  saveManyDiagramsSuccess: ["diagrams"],
  saveManyDiagramsFailure: null,
  setDocumentsPageMode: ["mode"]
})

const INITIAL_STATE = {
  diagrams: [],
  showCreateDiagramDialog: false,
  createDiagramName: "",
  createDiagramType: "er",
  showRenameDiagramDialog: false,
  showImportDiagramDialog: false,
  showMoveToFolderDialog: false,
  renameDiagramName: null,
  renameDiagramId: null,
  dropImportFileResults: [],
  documentsPageMode: "list" // One of "list" or "select"
}

const getDiagrams = state => state

const getDiagramsSuccess = (state, action) => ({
  ...state,
  diagrams: action.diagrams
})

const getDiagramsFailure = state => state

const saveDiagram = state => state

const saveDiagramSuccess = (state, action) => {
  const diagrams = state.diagrams.filter(d => d.id !== action.diagram.id)
  return {
    ...state,
    diagrams: [...diagrams, action.diagram]
  }
}

const saveDiagramFailure = state => state

const createDiagram = state => state

const createDiagramSuccess = (state, action) => {
  const diagrams = state.diagrams
  return {
    ...state,
    diagrams: [...diagrams, action.diagram],
    showCreateDiagramDialog: false,
    createDiagramName: "",
    createDiagramType: "er"
  }
}

const createDiagramDialogShow = state => ({
  ...state,
  showCreateDiagramDialog: true
})

const createDiagramDialogCancel = state => ({
  ...state,
  showCreateDiagramDialog: false,
  createDiagramName: "",
  createDiagramType: "er"
})

const setCreateDiagramName = (state, action) => ({
  ...state,
  createDiagramName: action.name
})

const setCreateDiagramType = (state, action) => ({
  ...state,
  createDiagramType: action.typ
})

const renameDiagramDialogShow = (state, action) => ({
  ...state,
  showRenameDiagramDialog: true,
  renameDiagramName: action.diagram.name,
  renameDiagramId: action.diagram.id
})

const renameDiagramDialogCancel = state => ({
  ...state,
  showRenameDiagramDialog: false,
  renameDiagramName: "",
  renameDiagramId: null
})

const renameDiagramNameChanged = (state, action) => ({
  ...state,
  renameDiagramName: action.name
})

const importDiagramDialogShow = state => ({
  ...state,
  showImportDiagramDialog: true,
  dropImportFileResults: []
})

const importDiagramDialogCancel = state => ({
  ...state,
  showImportDiagramDialog: false
})

const dropImportFile = state => state

const dropImportFileSuccess = (state, action) => {
  const dropImportFileResults = state.dropImportFileResults
  return {
    ...state,
    dropImportFileResults: [...dropImportFileResults, action.fileResult]
  }
}

const dropImportFileFailure = (state, action) => {
  const dropImportFileResults = state.dropImportFileResults
  return {
    ...state,
    dropImportFileResults: [...dropImportFileResults, action.fileResult]
  }
}

const removeImportFile = (state, action) => {
  const dropImportFileResults = [...state.dropImportFileResults]
  dropImportFileResults.splice(action.index, 1)
  return {
    ...state,
    dropImportFileResults
  }
}

const importDiagrams = state => state

const importDiagramsSuccess = (state, action) => {
  const diagrams = state.diagrams
  return {
    ...state,
    diagrams: [...diagrams, ...action.diagrams],
    dropImportFileResults: [],
    showImportDiagramDialog: false
  }
}

const importDiagramsFailure = state => ({
  ...state,
  showImportDiagramDialog: false
})

const deleteDiagram = state => state

const deleteDiagramSuccess = state => state

const deletediagramFailure = state => state

const moveToFolderDialogShow = state => ({
  ...state,
  showMoveToFolderDialog: true
})

const moveToFolderDialogCancel = state => ({
  ...state,
  showMoveToFolderDialog: false
})

const saveManyDiagrams = state => state

const saveManyDiagramsSuccess = (state, action) => {
  const savedDiagramIds = action.diagrams.map(d => d.id)
  const diagrams = state.diagrams.filter(d => savedDiagramIds.indexOf(d.id) === -1)
  return {
    ...state,
    documentsPageMode: "list",
    diagrams: [...diagrams, ...action.diagrams]
  }
}

const saveManyDiagramsFailure = state => ({
  ...state,
  documentsPageMode: "list"
})

const setDocumentsPageMode = (state, action) => ({
  ...state,
  documentsPageMode: action.mode
})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_DIAGRAMS]: getDiagrams,
  [Types.GET_DIAGRAMS_SUCCESS]: getDiagramsSuccess,
  [Types.GET_DIAGRAMS_FAILURE]: getDiagramsFailure,
  [Types.SAVE_DIAGRAM]: saveDiagram,
  [Types.SAVE_DIAGRAM_SUCCESS]: saveDiagramSuccess,
  [Types.SAVE_DIAGRAM_FAILURE]: saveDiagramFailure,
  [Types.CREATE_DIAGRAM]: createDiagram,
  [Types.CREATE_DIAGRAM_SUCCESS]: createDiagramSuccess,
  [Types.CREATE_DIAGRAM_DIALOG_SHOW]: createDiagramDialogShow,
  [Types.CREATE_DIAGRAM_DIALOG_CANCEL]: createDiagramDialogCancel,
  [Types.SET_CREATE_DIAGRAM_NAME]: setCreateDiagramName,
  [Types.SET_CREATE_DIAGRAM_TYPE]: setCreateDiagramType,
  [Types.RENAME_DIAGRAM_DIALOG_SHOW]: renameDiagramDialogShow,
  [Types.RENAME_DIAGRAM_DIALOG_CANCEL]: renameDiagramDialogCancel,
  [Types.IMPORT_DIAGRAM_DIALOG_SHOW]: importDiagramDialogShow,
  [Types.IMPORT_DIAGRAM_DIALOG_CANCEL]: importDiagramDialogCancel,
  [Types.DROP_IMPORT_FILE]: dropImportFile,
  [Types.DROP_IMPORT_FILE_SUCCESS]: dropImportFileSuccess,
  [Types.DROP_IMPORT_FILE_FAILURE]: dropImportFileFailure,
  [Types.REMOVE_IMPORT_FILE]: removeImportFile,
  [Types.RENAME_DIAGRAM_NAME_CHANGED]: renameDiagramNameChanged,
  [Types.IMPORT_DIAGRAMS]: importDiagrams,
  [Types.IMPORT_DIAGRAMS_SUCCESS]: importDiagramsSuccess,
  [Types.IMPORT_DIAGRAMS_FAILURE]: importDiagramsFailure,
  [Types.DELETE_DIAGRAM]: deleteDiagram,
  [Types.DELETE_DIAGRAM_SUCCESS]: deleteDiagramSuccess,
  [Types.DELETE_DIAGRAM_FAILURE]: deletediagramFailure,
  [Types.MOVE_TO_FOLDER_DIALOG_SHOW]: moveToFolderDialogShow,
  [Types.MOVE_TO_FOLDER_DIALOG_CANCEL]: moveToFolderDialogCancel,
  [Types.SAVE_MANY_DIAGRAMS]: saveManyDiagrams,
  [Types.SAVE_MANY_DIAGRAMS_SUCCESS]: saveManyDiagramsSuccess,
  [Types.SAVE_MANY_DIAGRAMS_FAILURE]: saveManyDiagramsFailure,
  [Types.SET_DOCUMENTS_PAGE_MODE]: setDocumentsPageMode
})

export const DiagramTypes = Types

export default Creators
