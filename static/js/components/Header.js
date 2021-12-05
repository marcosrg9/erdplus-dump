import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import { Link } from "react-router-dom"
import AuthActions from "../redux/Auth"
import GlobalActions from "../redux/Global"
import { withRouter } from "react-router-dom"
import AutoRenew from "@material-ui/icons/Autorenew"
import Snackbar from "@material-ui/core/Snackbar"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import ErrorIcon from "@material-ui/icons/Error"
import CloseIcon from "@material-ui/icons/Close"
import HomeIcon from "@material-ui/icons/Home"
import IconButton from "@material-ui/core/IconButton"

const styles = theme => ({
  header: {
    zIndex: theme.zIndex.appBar
  },
  "@keyframes rotator": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" }
  },
  button: {
    color: "#ffffff"
  },
  spinner: {
    animation: "$rotator 1.4s linear infinite",
    width: 50,
    height: 50
  },
  snackbar: {
    backgroundColor: theme.palette.error.dark
  },
  snackbarClose: {
    padding: theme.spacing(0.5)
  },
  snackbarIcon: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  snackbarMessage: {
    display: "flex",
    alignItems: "center"
  },
  socialMigrate: {
    backgroundColor: theme.palette.error.dark
  },
  socialMigrateMessage: {
    display: "flex",
    alignItems: "center",
    width: "500px"
  }
})

class Header extends Component {
  handleLogout = () => {
    this.props.logout(this.props.history)
  }

  hideToast = () => {
    this.props.hideToast()
  }

  socialMigrateClose = () => {
    this.props.setShowSocialMigrationWarning(false)
  }

  render() {
    const { isLoggedIn, showSocialMigrationWarning, name, busy, toast, toastMessage, classes } = this.props

    return (
      <header className={classes.header}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Button className={classes.button} component={Link} to="/">
              <HomeIcon />
            </Button>
            <Button className={classes.button} component={Link} to="/faq">
              FAQ
            </Button>

            {!isLoggedIn && (
              <Button className={classes.button} component={Link} to="/standalone">
                Try It!
              </Button>
            )}

            {isLoggedIn && (
              <Button className={classes.button} component={Link} to="/account">
                {name}
              </Button>
            )}
            {isLoggedIn && (
              <Button className={classes.button} component={Link} to="/documents">
                Documents
              </Button>
            )}
            {isLoggedIn && (
              <Button className={classes.button} onClick={this.handleLogout}>
                Logout
              </Button>
            )}

            {!isLoggedIn && (
              <Button className={classes.button} component={Link} to="/create-account">
                Signup
              </Button>
            )}
            {!isLoggedIn && (
              <Button className={classes.button} component={Link} to="/login">
                Login
              </Button>
            )}

            {busy && <AutoRenew className={classes.spinner} />}
          </Toolbar>
        </AppBar>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={toast}
          autoHideDuration={7000}
          onClose={this.hideToast}>
          <SnackbarContent
            aria-describedby="client-snackbar"
            className={classes.snackbar}
            message={
              <span id="client-snackbar" className={classes.snackbarMessage}>
                <ErrorIcon className={classes.snackbarIcon} />
                {toastMessage}
              </span>
            }
            action={
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.snackbarClose}
                onClick={this.hideToast}>
                <CloseIcon />
              </IconButton>
            }>
            <ErrorIcon />
          </SnackbarContent>
        </Snackbar>
      </header>
    )
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    showSocialMigrationWarning: state.auth.showSocialMigrationWarning,
    name: state.auth.session.name,
    busy: state.global.busy,
    toast: state.global.toast,
    toastMessage: state.global.toastMessage
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: history => dispatch(AuthActions.logout(history)),
    hideToast: () => dispatch(GlobalActions.hideToast()),
    setShowSocialMigrationWarning: show => dispatch(AuthActions.setShowSocialMigrationWarning(show))
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Header)
  )
)
