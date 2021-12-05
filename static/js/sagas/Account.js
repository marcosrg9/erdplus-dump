import { call, put, takeEvery } from "redux-saga/effects"
import * as Api from "../lib/Api"
import AccountActions, { AccountTypes } from "../redux/Account"
import AuthActions from "../redux/Auth"
import GlobalActions from "../redux/Global"
import DiagramActions from "../redux/Diagram"
import FolderActions from "../redux/Folder"
import { resetApiToken } from "../lib/Token"

function* createAccount(action) {
  try {
    yield put(GlobalActions.setBusy())
    yield call(Api.postAccount, {
      name: action.name,
      email: action.email,
      password: action.password
    })
    yield put(AuthActions.login(action.email, action.password, action.history))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* getAccount(action) {
  try {
    yield put(GlobalActions.setBusy())
    const res = yield call(Api.getAccount)
    const account = res.data
    yield put(AccountActions.getAccountSuccess(account))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* updateAccount(action) {
  try {
    yield put(GlobalActions.setBusy())
    const res = yield call(Api.putAccount, { name: action.name })
    const account = res.data
    yield put(AccountActions.updateAccountSuccess(account))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* changePassword(action) {
  try {
    yield put(GlobalActions.setBusy())
    const { currentPassword, newPassword } = action
    yield call(Api.postChangePassword, {
      currentPassword,
      newPassword
    })
    yield put(AccountActions.changePasswordSuccess())
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* deleteAccount(action) {
  try {
    yield put(GlobalActions.setBusy())
    yield call(Api.deleteAccount)
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

function* doSocialMigration(action) {
  try {
    yield put(GlobalActions.setBusy())
    yield call(Api.postMigrateSocial, {
      email: action.email,
      password: action.password
    })
    yield put(AuthActions.login(action.email, action.password, action.history))
  } catch (e) {
    if (e.response && e.response.data && e.response.data.errors && e.response.data.errors.length > 0) {
      yield put(GlobalActions.showToast(e.response.data.errors[0]))
    } else {
      yield put(GlobalActions.showToast("Error"))
    }
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

export function* createAccountSaga() {
  yield takeEvery(AccountTypes.CREATE_ACCOUNT, createAccount)
}

export function* getAccountSaga() {
  yield takeEvery(AccountTypes.GET_ACCOUNT, getAccount)
}

export function* updateAccountSaga() {
  yield takeEvery(AccountTypes.UPDATE_ACCOUNT, updateAccount)
}

export function* changePasswordSaga() {
  yield takeEvery(AccountTypes.CHANGE_PASSWORD, changePassword)
}

export function* deleteAccountSaga() {
  yield takeEvery(AccountTypes.DELETE_ACCOUNT, deleteAccount)
}

export function* doSocialMigrationSaga() {
  yield takeEvery(AccountTypes.DO_SOCIAL_MIGRATION, doSocialMigration)
}
