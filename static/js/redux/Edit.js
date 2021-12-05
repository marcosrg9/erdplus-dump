import { createReducer, createActions } from "reduxsauce"

const { Types, Creators } = createActions({
  setContext: ["contextDetails", "contextType"],
  clearContext: null,
  setMouseMode: ["mouseMode"],
  setUndoRedo: ["canUndo", "canRedo"],
  setCanDelete: ["canDelete"],
  setCanvasSize: ["width", "height"],
  showCanvasSizeDialog: ["minCanvasWidth", "minCanvasHeight"],
  hideCanvasSizeDialog: null,
  showExportImageDialog: ["diagramContent"],
  hideExportImageDialog: null,
  createExportImageData: ["diagramContent", "transparent", "scale"],
  createExportImageDataSuccess: ["dataUrl", "blob"],
  updateExportImageOptions: ["transparent", "scale"],
  setIsDirty: ["isDirty"],
  saveEditDiagram: ["diagram"]
})

const INITIAL_STATE = {
  contextDetails: {},
  contextType: "",
  mouseMode: "none",
  canUndo: false,
  canRedo: false,
  canDelete: false,
  canvasWidth: 2000,
  canvasHeight: 1000,
  showCanvasSizeDialog: false,
  minCanvasWidth: 0, // Supports canvas resize dialog
  minCanvasHeight: 0, // Supports canvas resize dialog
  showExportImageDialog: false,
  exportImageContent: "",
  exportImageTransparent: false,
  exportImageScale: 1,
  exportImageDataUrl: "",
  exportImageBlob: null,
  isDirty: false
}

const setContext = (state, action) => ({
  ...state,
  contextDetails: action.contextDetails,
  contextType: action.contextType
})

const clearContext = state => ({
  ...state,
  contextDetails: {},
  contextType: ""
})

const setMouseMode = (state, action) => ({
  ...state,
  mouseMode: action.mouseMode
})

const setUndoRedo = (state, action) => ({
  ...state,
  canUndo: action.canUndo,
  canRedo: action.canRedo
})

const setCanDelete = (state, action) => ({
  ...state,
  canDelete: action.canDelete
})

const setCanvasSize = (state, action) => ({
  ...state,
  canvasWidth: action.width,
  canvasHeight: action.height,
  showCanvasSizeDialog: false
})

const showCanvasSizeDialog = (state, action) => ({
  ...state,
  showCanvasSizeDialog: true,
  minCanvasWidth: action.minCanvasWidth,
  minCanvasHeight: action.minCanvasHeight
})

const hideCanvasSizeDialog = state => ({
  ...state,
  showCanvasSizeDialog: false
})

const showExportImageDialog = (state, action) => ({
  ...state,
  showExportImageDialog: true,
  exportImageContent: action.diagramContent
})

const hideExportImageDialog = state => ({
  ...state,
  showExportImageDialog: false,
  exportImageDataUrl: "",
  exportImageBlob: null
})

const createExportImageData = state => state

const createExportImageDataSuccess = (state, action) => ({
  ...state,
  exportImageDataUrl: action.dataUrl,
  exportImageBlob: action.blob
})

const updateExportImageOptions = (state, action) => ({
  ...state,
  exportImageTransparent: action.transparent,
  exportImageScale: action.scale
})

const setIsDirty = (state, action) => ({
  ...state,
  isDirty: action.isDirty
})

const saveEditDiagram = state => state

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CONTEXT]: setContext,
  [Types.CLEAR_CONTEXT]: clearContext,
  [Types.SET_MOUSE_MODE]: setMouseMode,
  [Types.SET_UNDO_REDO]: setUndoRedo,
  [Types.SET_CAN_DELETE]: setCanDelete,
  [Types.SET_CANVAS_SIZE]: setCanvasSize,
  [Types.SHOW_CANVAS_SIZE_DIALOG]: showCanvasSizeDialog,
  [Types.HIDE_CANVAS_SIZE_DIALOG]: hideCanvasSizeDialog,
  [Types.SHOW_EXPORT_IMAGE_DIALOG]: showExportImageDialog,
  [Types.HIDE_EXPORT_IMAGE_DIALOG]: hideExportImageDialog,
  [Types.CREATE_EXPORT_IMAGE_DATA]: createExportImageData,
  [Types.CREATE_EXPORT_IMAGE_DATA_SUCCESS]: createExportImageDataSuccess,
  [Types.UPDATE_EXPORT_IMAGE_OPTIONS]: updateExportImageOptions,
  [Types.SET_IS_DIRTY]: setIsDirty,
  [Types.SAVE_EDIT_DIAGRAM]: saveEditDiagram
})

export const EditTypes = Types

export default Creators
