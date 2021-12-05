import { call, put, takeEvery } from "redux-saga/effects"
import * as Api from "../lib/Api"
import AuthActions, { AuthTypes } from "../redux/Auth"
import DiagramActions from "../redux/Diagram"
import FolderActions from "../redux/Folder"
import AccountActions from "../redux/Account"
import GlobalActions from "../redux/Global"
import { getApiToken, setApiToken, tryDecode, resetApiToken } from "../lib/Token"
import ReactGA from "react-ga"

function* login(action) {
  try {
    yield put(GlobalActions.setBusy())
    const res = yield call(Api.postEmailSession, {
      email: action.email,
      password: action.password
    })
    const token = res.data.accessToken
    setApiToken(token)
    const session = tryDecode(token)
    yield put(DiagramActions.getDiagrams())
    yield put(FolderActions.getFolders())
    yield put(AccountActions.getAccount())
    yield put(AuthActions.loginSuccess(session))
    action.history.push("/documents")
    ReactGA.event({
      category: "user login",
      action: "email"
    })
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* logout(action) {
  try {
    yield put(GlobalActions.setBusy())
    resetApiToken()
    yield put(AuthActions.logoutSuccess())
    yield put(DiagramActions.getDiagramsSuccess([]))
    yield put(FolderActions.getFoldersSuccess([]))
    yield put(AccountActions.getAccountSuccess({}))
    action.history.push("/")
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

const authenticatedPages = new RegExp("^(/account|/documents|/edit-diagram)")

function* verifyToken(action) {
  try {
    yield put(GlobalActions.setBusy())
    const res = yield call(Api.getSession)
    if (res.status === 200) {
      const session = tryDecode(getApiToken())
      yield put(DiagramActions.getDiagrams())
      yield put(FolderActions.getFolders())
      yield put(AccountActions.getAccount())
      yield put(AuthActions.verifyTokenSuccess(session))
    } else {
      if (authenticatedPages.test(action.history.location.pathname)) {
        action.history.push("/")
      }
      yield call(resetApiToken)
      yield put(AuthActions.verifyTokenFailure())
    }
  } catch (e) {
    if (authenticatedPages.test(action.history.location.pathname)) {
      action.history.push("/")
    }

    yield call(resetApiToken)
    yield put(AuthActions.verifyTokenFailure())
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* googleLogin(action) {
  try {
    yield put(GlobalActions.setBusy())
    const idToken = action.idToken
    const res = yield call(Api.postGoogleSession, {
      idToken
    })
    const token = res.data.accessToken
    setApiToken(token)
    const session = tryDecode(token)
    yield put(DiagramActions.getDiagrams())
    yield put(FolderActions.getFolders())
    yield put(AccountActions.getAccount())
    yield put(AuthActions.loginSuccess(session))
    action.history.push("/documents")
    ReactGA.event({
      category: "user login",
      action: "google"
    })
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

export function* loginSaga() {
  yield takeEvery(AuthTypes.LOGIN, login)
}

export function* logoutSaga() {
  yield takeEvery(AuthTypes.LOGOUT, logout)
}

export function* verifyTokenSaga() {
  yield takeEvery(AuthTypes.VERIFY_TOKEN, verifyToken)
}

export function* googleLoginSaga() {
  yield takeEvery(AuthTypes.GOOGLE_LOGIN, googleLogin)
}
