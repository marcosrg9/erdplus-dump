import { createStore, applyMiddleware, compose } from "redux"
import createSagaMiddleware from "redux-saga"
import { loginSaga, logoutSaga, verifyTokenSaga, googleLoginSaga } from "./sagas/Auth"
import { getFoldersSaga, createFolderSaga, renameFolderSaga, deleteFolderSaga } from "./sagas/Folder"
import {
  getDiagramsSaga,
  saveDiagramSaga,
  createDiagramSaga,
  deleteDiagramSaga,
  dropImportFileSaga,
  importDiagramsSaga,
  createExportImageDataSaga,
  saveManyDiagramsSaga
} from "./sagas/Diagram"
import {
  createAccountSaga,
  getAccountSaga,
  updateAccountSaga,
  changePasswordSaga,
  deleteAccountSaga,
  doSocialMigrationSaga
} from "./sagas/Account"
import { resetPasswordStartSaga, resetPasswordCompleteSaga } from "./sagas/ResetPassword"
import { convertToRelationalSaga, generateSqlSaga } from "./sagas/Convert"
import { saveEditDiagramSaga } from "./sagas/Edit"
import reducers from "./redux"

export default () => {
  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware()

  const middlewares = [sagaMiddleware]
  const enhancers = middlewares.map(a => applyMiddleware(a))

  const getComposeFunc = () => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line global-require
      const { composeWithDevTools } = require("redux-devtools-extension")
      return composeWithDevTools({
        serialize: {
          options: false
        }
      })
    }
    return compose
  }

  const composeFunc = getComposeFunc()
  const composedEnhancers = composeFunc(...enhancers)

  const store = createStore(reducers, {}, composedEnhancers)

  sagaMiddleware.run(loginSaga)
  sagaMiddleware.run(logoutSaga)
  sagaMiddleware.run(verifyTokenSaga)
  sagaMiddleware.run(googleLoginSaga)

  sagaMiddleware.run(getFoldersSaga)
  sagaMiddleware.run(createFolderSaga)
  sagaMiddleware.run(renameFolderSaga)
  sagaMiddleware.run(deleteFolderSaga)

  sagaMiddleware.run(getDiagramsSaga)
  sagaMiddleware.run(saveDiagramSaga)
  sagaMiddleware.run(createDiagramSaga)
  sagaMiddleware.run(deleteDiagramSaga)
  sagaMiddleware.run(dropImportFileSaga)
  sagaMiddleware.run(importDiagramsSaga)
  sagaMiddleware.run(createExportImageDataSaga)
  sagaMiddleware.run(saveManyDiagramsSaga)

  sagaMiddleware.run(createAccountSaga)
  sagaMiddleware.run(getAccountSaga)
  sagaMiddleware.run(updateAccountSaga)
  sagaMiddleware.run(changePasswordSaga)
  sagaMiddleware.run(deleteAccountSaga)
  sagaMiddleware.run(doSocialMigrationSaga)

  sagaMiddleware.run(resetPasswordStartSaga)
  sagaMiddleware.run(resetPasswordCompleteSaga)

  sagaMiddleware.run(convertToRelationalSaga)
  sagaMiddleware.run(generateSqlSaga)

  sagaMiddleware.run(saveEditDiagramSaga)

  return store
}
