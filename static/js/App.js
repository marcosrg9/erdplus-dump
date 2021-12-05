import React from "react"
import AppContent from "./components/AppContent"
import CssBaseline from "@material-ui/core/CssBaseline"
import { Router } from "react-router-dom"

function App({ history }) {
  return (
    <React.Fragment>
      <CssBaseline />
      <Router history={history}>
        <AppContent />
      </Router>
    </React.Fragment>
  )
}

export default App
