import { createReducer, createActions } from "reduxsauce"

const { Types, Creators } = createActions({
  getFolders: null,
  getFoldersSuccess: ["folders"],
  getFoldersFailure: null,
  expandFolder: ["folderId"],
  collapseFolder: ["folderId"],
  createFolderDialogShow: null,
  createFolderDialogCancel: null,
  newFolderNameChanged: ["newFolderName"],
  createFolder: ["name", "parentId"],
  createFolderSuccess: ["folder"],
  createFolderFailure: null,
  selectFolder: ["folderId"],
  editFolderDialogShow: ["folderId", "name"],
  editFolderDialogCancel: null,
  editFolderNameChanged: ["name"],
  renameFolder: ["folder"],
  renameFolderSuccess: ["folder"],
  renameFolderFailure: null,
  deleteFolderDialogShow: ["folderId"],
  deleteFolderDialogCancel: null,
  deleteFolder: ["folderId"],
  deleteFolderSuccess: null,
  deleteFolderFailure: null
})

const INITIAL_STATE = {
  folders: [],
  foldersMeta: [],
  currentFolderId: null,
  showNewFolder: false,
  newFolderName: "",
  showEditFolder: false,
  editFolderNewName: "",
  editFolderId: null,
  showDeleteFolder: false,
  deleteFolderName: "",
  deleteFolderId: null
}

const getFolders = state => state

const getFoldersSuccess = (state, action) => {
  const foldersMeta = action.folders.map(folder => ({
    id: folder.id,
    isOpen: folder.folderType === "root"
  }))
  const currentFolder = action.folders.find(folder => folder.folderType === "root")
  return {
    ...state,
    folders: action.folders,
    foldersMeta,
    currentFolderId: currentFolder ? currentFolder.id : null
  }
}

const getFoldersFailure = state => ({
  ...state,
  folders: [],
  foldersMeta: []
})

const expandFolder = (state, action) => {
  const foldersMeta = state.foldersMeta.map(m => {
    if (m.id === action.folderId) {
      return {
        ...m,
        isOpen: true
      }
    } else {
      return m
    }
  })
  return {
    ...state,
    foldersMeta
  }
}

const collapseFolder = (state, action) => {
  const foldersMeta = state.foldersMeta.map(m => {
    if (m.id === action.folderId) {
      return {
        ...m,
        isOpen: false
      }
    } else {
      return m
    }
  })
  return {
    ...state,
    foldersMeta
  }
}

const createFolderDialogShow = state => ({
  ...state,
  showNewFolder: true,
  newFolderName: ""
})

const createFolderDialogCancel = state => ({
  ...state,
  showNewFolder: false
})

const newFolderNameChanged = (state, action) => ({
  ...state,
  newFolderName: action.newFolderName
})

const createFolder = state => state

const createFolderSuccess = (state, action) => {
  const foldersMeta = [...state.foldersMeta, { id: action.folder.id, isOpen: false }]
  const folders = [...state.folders, action.folder]
  return {
    ...state,
    showNewFolder: false,
    folders,
    foldersMeta
  }
}

const createFolderFailure = state => ({
  ...state,
  showNewFolder: false
})

const selectFolder = (state, action) => ({
  ...state,
  currentFolderId: action.folderId
})

const editFolderDialogShow = (state, action) => {
  const folder = state.folders.find(f => f.id === action.folderId)
  return {
    ...state,
    showEditFolder: true,
    editFolderNewName: folder.name,
    editFolderId: action.folderId
  }
}

const editFolderDialogCancel = state => ({
  ...state,
  showEditFolder: false
})

const editFolderNameChanged = (state, action) => ({
  ...state,
  editFolderNewName: action.name
})

const renameFolder = state => state

const renameFolderSuccess = (state, action) => {
  const otherFolders = state.folders.filter(f => f.id !== action.folder.id)
  const folders = [...otherFolders, action.folder]
  return {
    ...state,
    showEditFolder: false,
    folders
  }
}

const renameFolderFailure = (state, action) => ({
  ...state,
  showEditFolder: false
})

const deleteFolderDialogShow = (state, action) => {
  const folder = state.folders.find(f => f.id === action.folderId)
  return {
    ...state,
    showDeleteFolder: true,
    deleteFolderName: folder.name,
    deleteFolderId: action.folderId
  }
}

const deleteFolderDialogCancel = (state, action) => ({
  ...state,
  showDeleteFolder: false
})

const deleteFolder = state => state

const deleteFolderSuccess = (state, action) => ({
  ...state,
  showDeleteFolder: false
})

const deleteFolderFailure = (state, action) => ({
  ...state,
  showDeleteFolder: false
})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_FOLDERS]: getFolders,
  [Types.GET_FOLDERS_SUCCESS]: getFoldersSuccess,
  [Types.GET_FOLDERS_FAILURE]: getFoldersFailure,
  [Types.EXPAND_FOLDER]: expandFolder,
  [Types.COLLAPSE_FOLDER]: collapseFolder,
  [Types.CREATE_FOLDER_DIALOG_SHOW]: createFolderDialogShow,
  [Types.CREATE_FOLDER_DIALOG_CANCEL]: createFolderDialogCancel,
  [Types.NEW_FOLDER_NAME_CHANGED]: newFolderNameChanged,
  [Types.CREATE_FOLDER]: createFolder,
  [Types.CREATE_FOLDER_SUCCESS]: createFolderSuccess,
  [Types.CREATE_FOLDER_FAILURE]: createFolderFailure,
  [Types.SELECT_FOLDER]: selectFolder,
  [Types.EDIT_FOLDER_DIALOG_SHOW]: editFolderDialogShow,
  [Types.EDIT_FOLDER_DIALOG_CANCEL]: editFolderDialogCancel,
  [Types.EDIT_FOLDER_NAME_CHANGED]: editFolderNameChanged,
  [Types.RENAME_FOLDER]: renameFolder,
  [Types.RENAME_FOLDER_SUCCESS]: renameFolderSuccess,
  [Types.RENAME_FOLDER_FAILURE]: renameFolderFailure,
  [Types.DELETE_FOLDER_DIALOG_SHOW]: deleteFolderDialogShow,
  [Types.DELETE_FOLDER_DIALOG_CANCEL]: deleteFolderDialogCancel,
  [Types.DELETE_FOLDER]: deleteFolder,
  [Types.DELETE_FOLDER_SUCCESS]: deleteFolderSuccess,
  [Types.DELETE_FOLDER_FAILURE]: deleteFolderFailure
})

export const FolderTypes = Types

export default Creators
