import { call, put, takeEvery } from "redux-saga/effects"
import * as Api from "../lib/Api"
import ResetPasswordActions, { ResetPasswordTypes } from "../redux/ResetPassword"
import AuthActions from "../redux/Auth"
import DiagramActions from "../redux/Diagram"
import FolderActions from "../redux/Folder"
import AccountActions from "../redux/Account"
import GlobalActions from "../redux/Global"
import { setApiToken, tryDecode } from "../lib/Token"

function* resetPasswordStart(action) {
  try {
    yield put(GlobalActions.setBusy())
    const result = yield call(Api.postResetPasswordStart, {
      email: action.email
    })
    const { email, duration } = result.data
    yield put(ResetPasswordActions.resetPasswordStartSuccess(email, duration))
  } catch (e) {
    yield put(ResetPasswordActions.resetPasswordStartFailure("some error"))
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* resetPasswordComplete(action) {
  try {
    yield put(GlobalActions.setBusy())
    const result = yield call(Api.putResetPasswordStart, {
      token: action.token,
      password: action.password
    })
    yield put(ResetPasswordActions.resetPasswordCompleteSuccess())
    const token = result.data.accessToken
    setApiToken(token)
    const session = tryDecode(token)
    yield put(DiagramActions.getDiagrams())
    yield put(FolderActions.getFolders())
    yield put(AccountActions.getAccount())
    yield put(AuthActions.loginSuccess(session))
    action.history.push("/documents")
  } catch (e) {
    yield put(ResetPasswordActions.resetPasswordCompleteFailure("some error"))
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

export function* resetPasswordStartSaga() {
  yield takeEvery(ResetPasswordTypes.RESET_PASSWORD_START, resetPasswordStart)
}

export function* resetPasswordCompleteSaga() {
  yield takeEvery(ResetPasswordTypes.RESET_PASSWORD_COMPLETE, resetPasswordComplete)
}
