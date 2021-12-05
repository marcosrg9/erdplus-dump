import React, { Component } from "react"
import { withRouter } from "react-router"
import { Route, Switch } from "react-router-dom"
import { connect } from "react-redux"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import AccountPage from "./AccountPage"
import CreateAccountPage from "./CreateAccountPage"
import DocumentsPage from "./DocumentsPage"
import EditDiagramPage from "./EditDiagramPage"
import ResetPasswordCompletePage from "./ResetPasswordCompletePage"
import ResetPasswordStartPage from "./ResetPasswordStartPage"
import FaqPage from "./FaqPage"
import PrivacyPolicyPage from "./PrivacyPolicyPage"
import HomePage from "./HomePage"
import LoginPage from "./LoginPage"
import StandalonePage from "./StandalonePage"
import Missing404Page from "./Missing404Page"
import AuthActions from "../redux/Auth"
import FolderActions from "../redux/Folder"
import DiagramActions from "../redux/Diagram"
import AccountActions from "../redux/Account"
import themes from "../themes"
import LoadingPage from "./LoadingPage"
// import blue from "@material-ui/core/colors/blue"
// import green from "@material-ui/core/colors/green"

const theme = createMuiTheme({
  ...themes.amber
})

class AppContent extends Component {
  componentDidMount() {
    this.props.verifyToken(this.props.history)
  }

  render() {
    console.log("theme: ", theme)

    const { isLoggedIn, verifyTokenComplete } = this.props

    return (
      <MuiThemeProvider theme={theme}>
        {!verifyTokenComplete && <Route component={LoadingPage} />}

        {verifyTokenComplete && (
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/faq" component={FaqPage} />
            <Route exact path="/privacy-policy" component={PrivacyPolicyPage} />
            <Route exact path="/reset-password/:token" component={ResetPasswordCompletePage} />

            {!isLoggedIn && <Route exact path="/standalone" component={StandalonePage} />}
            {!isLoggedIn && <Route exact path="/login" component={LoginPage} />}
            {!isLoggedIn && <Route exact path="/create-account" component={CreateAccountPage} />}
            {!isLoggedIn && <Route exact path="/forgot-password" component={ResetPasswordStartPage} />}

            {isLoggedIn && <Route exact path="/account" component={AccountPage} />}
            {isLoggedIn && <Route exact path="/documents" component={DocumentsPage} />}
            {isLoggedIn && <Route exact path="/edit-diagram/:id" component={EditDiagramPage} />}

            <Route component={Missing404Page} />
          </Switch>
        )}
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    verifyTokenComplete: state.auth.verifyTokenComplete
  }
}

const mapDispatchToProps = dispatch => {
  return {
    verifyToken: history => dispatch(AuthActions.verifyToken(history)),
    getFolders: () => dispatch(FolderActions.getFolders()),
    getDiagrams: () => dispatch(DiagramActions.getDiagrams()),
    getAccount: () => dispatch(AccountActions.getAccount())
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppContent)
)
