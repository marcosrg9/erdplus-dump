import { call, put, takeEvery } from "redux-saga/effects"
import * as Api from "../lib/Api"
import DiagramActions from "../redux/Diagram"
import EditActions, { EditTypes } from "../redux/Edit"
import GlobalActions from "../redux/Global"

function* saveEditDiagram(action) {
  try {
    yield put(GlobalActions.setBusy())
    const res = yield call(Api.putDiagram, action.diagram)
    const diagram = res.data
    yield put(DiagramActions.saveDiagramSuccess(diagram))
    yield put(EditActions.setIsDirty(false))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

export function* saveEditDiagramSaga() {
  yield takeEvery(EditTypes.SAVE_EDIT_DIAGRAM, saveEditDiagram)
}
