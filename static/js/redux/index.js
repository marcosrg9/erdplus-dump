import { combineReducers } from "redux"
import { reducer as account } from "./Account"
import { reducer as auth } from "./Auth"
import { reducer as diagram } from "./Diagram"
import { reducer as edit } from "./Edit"
import { reducer as folder } from "./Folder"
import { reducer as resetPassword } from "./ResetPassword"
import { reducer as convert } from "./Convert"
import { reducer as global } from "./Global"

export default combineReducers({
  account,
  auth,
  diagram,
  edit,
  folder,
  resetPassword,
  convert,
  global
})
