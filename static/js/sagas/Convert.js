import { call, put, takeEvery } from "redux-saga/effects"
import * as Api from "../lib/Api"
import ConvertActions, { ConvertTypes } from "../redux/Convert"
import DiagramActions from "../redux/Diagram"
import GlobalActions from "../redux/Global"
import ErdToRelationalConverter from "../lib/ErdToRelationalConverter"
import SqlGenerator from "../lib/SqlGenerator"

function* convertToRelational(action) {
  try {
    yield put(GlobalActions.setBusy())
    const { folderId, name, content, edit, history } = action

    const converter = new ErdToRelationalConverter(content)
    const relationalContent = JSON.stringify(converter.convert())
    const relationalDiagram = {
      folderId,
      name,
      content: relationalContent,
      diagramType: "relational"
    }
    const res = yield call(Api.postDiagram, relationalDiagram)
    const diagram = res.data
    yield put(DiagramActions.createDiagramSuccess(diagram))
    yield put(ConvertActions.hideConvertToRelationalDialog())
    if (edit) {
      history.push(`/edit-diagram/${diagram.id}`)
    }
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

function* generateSql(action) {
  try {
    yield put(GlobalActions.setBusy())
    const { content } = action

    const generator = new SqlGenerator(content)
    const sql = generator.generate()
    yield put(ConvertActions.generateSqlSuccess(sql))
  } catch (e) {
    yield put(GlobalActions.showToast("Error"))
    yield put(ConvertActions.generateSqlFailure())
  } finally {
    yield put(GlobalActions.clearBusy())
  }
}

export function* convertToRelationalSaga() {
  yield takeEvery(ConvertTypes.CONVERT_TO_RELATIONAL, convertToRelational)
}

export function* generateSqlSaga() {
  yield takeEvery(ConvertTypes.GENERATE_SQL, generateSql)
}
