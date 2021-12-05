import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { unregister } from "./registerServiceWorker"
import { Provider } from "react-redux"
import configureStore from "./configureStore"
import { createBrowserHistory } from "history"
import ReactGA from "react-ga"

ReactGA.initialize("UA-28400705-1", {
  titleCase: false,
  debug: true
})

const history = createBrowserHistory()
const store = configureStore(history)

function render(Component) {
  ReactDOM.render(
    <Provider store={store}>
      <Component history={history} />
    </Provider>,
    document.getElementById("root")
  )
}

render(App)

unregister()
