import { all, call, put, takeEvery } from "redux-saga/effects"
import * as Api from "../lib/Api"
import DiagramActions, { DiagramTypes } from "../redux/Diagram"
import EditActions, { EditTypes } from "../redux/Edit"
import GlobalActions from "../redux/Global"
import handleImportFile from "../lib/Import"
import createImage from "../lib/ExportImage"

function* getDiagrams() {
  try {
    yield put(GlobalActions.setBusy())
    const res = yield call(Api.getDiagrams)
    const diagrams = res.data
    yield put(DiagramActions.getDiagramsSuccess(diagrams))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* saveDiagram(action) {
  try {
    yield put(GlobalActions.setBusy())
    const res = yield call(Api.putDiagram, action.diagram)
    const diagram = res.data
    yield put(DiagramActions.saveDiagramSuccess(diagram))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* createDiagram(action) {
  try {
    yield put(GlobalActions.setBusy())
    const res = yield call(Api.postDiagram, action.diagram)
    const diagram = res.data
    yield put(DiagramActions.createDiagramSuccess(diagram))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* deleteDiagram(action) {
  try {
    yield put(GlobalActions.setBusy())
    yield call(Api.deleteDiagram, action.diagramId)
    yield put(DiagramActions.getDiagrams())
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* dropImportFile(action) {
  try {
    yield put(GlobalActions.setBusy())
    const fileResult = yield call(handleImportFile, action.file, action.currentFolderId)
    yield put(DiagramActions.dropImportFileSuccess(fileResult))
  } catch (e) {
    yield put(DiagramActions.dropImportFileFailure(e))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* importDiagrams(action) {
  try {
    yield put(GlobalActions.setBusy())
    const diagrams = action.diagrams
    const results = yield all(diagrams.map(d => call(Api.postDiagram, d)))
    const createdDiagrams = results.map(r => r.data)
    yield put(DiagramActions.importDiagramsSuccess(createdDiagrams))
  } catch (e) {
    yield put(DiagramActions.importDiagramsFailure())
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* createExportImageData(action) {
  try {
    const { diagramContent, transparent, scale } = action
    const result = yield call(createImage, diagramContent, transparent, scale)
    yield put(EditActions.createExportImageDataSuccess(result.dataUrl, result.blob))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  }
}

function* saveManyDiagrams(action) {
  try {
    yield put(GlobalActions.setBusy())
    const results = yield all(action.diagrams.map(d => call(Api.putDiagram, d)))
    const diagrams = results.map(r => r.data)
    yield put(DiagramActions.saveManyDiagramsSuccess(diagrams))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

export function* getDiagramsSaga() {
  yield takeEvery(DiagramTypes.GET_DIAGRAMS, getDiagrams)
}

export function* saveDiagramSaga() {
  yield takeEvery(DiagramTypes.SAVE_DIAGRAM, saveDiagram)
}

export function* createDiagramSaga() {
  yield takeEvery(DiagramTypes.CREATE_DIAGRAM, createDiagram)
}

export function* deleteDiagramSaga() {
  yield takeEvery(DiagramTypes.DELETE_DIAGRAM, deleteDiagram)
}

export function* dropImportFileSaga() {
  yield takeEvery(DiagramTypes.DROP_IMPORT_FILE, dropImportFile)
}

export function* importDiagramsSaga() {
  yield takeEvery(DiagramTypes.IMPORT_DIAGRAMS, importDiagrams)
}

export function* createExportImageDataSaga() {
  yield takeEvery(EditTypes.CREATE_EXPORT_IMAGE_DATA, createExportImageData)
}

export function* saveManyDiagramsSaga() {
  yield takeEvery(DiagramTypes.SAVE_MANY_DIAGRAMS, saveManyDiagrams)
}
