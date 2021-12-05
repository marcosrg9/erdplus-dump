import { call, put, takeEvery } from "redux-saga/effects"
import * as Api from "../lib/Api"
import FolderActions, { FolderTypes } from "../redux/Folder"
import DiagramActions from "../redux/Diagram"
import GlobalActions from "../redux/Global"

function* getFolders() {
  try {
    yield put(GlobalActions.setBusy())
    const res = yield call(Api.getFolders)
    const folders = res.data
    yield put(FolderActions.getFoldersSuccess(folders))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* createFolder(action) {
  try {
    yield put(GlobalActions.setBusy())
    const res = yield call(Api.postFolder, { name: action.name, parentId: action.parentId })
    const folder = res.data
    yield put(FolderActions.createFolderSuccess(folder))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* renameFolder(action) {
  try {
    yield put(GlobalActions.setBusy())
    const res = yield call(Api.putFolder, action.folder)
    const folder = res.data
    yield put(FolderActions.renameFolderSuccess(folder))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* deleteFolder(action) {
  try {
    yield put(GlobalActions.setBusy())
    yield call(Api.deleteFolder, action.folderId)
    yield put(DiagramActions.getDiagrams())
    yield put(FolderActions.getFolders())
    yield put(FolderActions.deleteFolderSuccess())
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

export function* getFoldersSaga() {
  yield takeEvery(FolderTypes.GET_FOLDERS, getFolders)
}

export function* createFolderSaga() {
  yield takeEvery(FolderTypes.CREATE_FOLDER, createFolder)
}

export function* renameFolderSaga() {
  yield takeEvery(FolderTypes.RENAME_FOLDER, renameFolder)
}

export function* deleteFolderSaga() {
  yield takeEvery(FolderTypes.DELETE_FOLDER, deleteFolder)
}
