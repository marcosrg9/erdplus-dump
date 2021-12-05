import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Header from "./Header"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import ResetPasswordActions from "../redux/ResetPassword"
import { getResetPasswordToken } from "../selectors/resetPasswordTokenSelector"
import { withRouter } from "react-router-dom"
import ReactGA from "react-ga"

const styles = theme => ({
  textField: {
    margin: theme.spacing(1),
    width: 300
  },
  submitButton: {
    margin: theme.spacing(1),
    width: 200
  },
  section: {
    height: "100%",
    display: "flex",
    flexFlow: "column"
  },
  grid: {
    paddingTop: theme.spacing(3),
    textAlign: "center"
  }
})

class ResetPasswordSubmitPage extends Component {
  state = {
    password: "",
    confirmPassword: "",
    isPasswordDirty: false,
    isConfirmPasswordDirty: false
  }

  componentDidMount() {
    ReactGA.pageview("/reset-password")
  }

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value,
      isPasswordDirty: true
    })
  }

  handleConfirmPasswordChange = event => {
    this.setState({
      confirmPassword: event.target.value,
      isConfirmPasswordDirty: true
    })
  }

  handleSubmit = () => {
    this.props.resetPasswordComplete(this.props.token, this.state.password, this.props.history)
  }

  render() {
    const { classes } = this.props

    const { password, confirmPassword, isPasswordDirty, isConfirmPasswordDirty } = this.state

    const disabled = !password || password.length < 8 || password !== confirmPassword

    const passwordHelperText = isPasswordDirty && password.length < 8 ? "Password must be longer than 8 characters" : ""
    const confirmPasswordHelperText =
      isConfirmPasswordDirty && password !== confirmPassword ? "Passwords do not match" : ""

    return (
      <section className={classes.section}>
        <Header />
        <Grid container className={classes.grid} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4">Reset Forgotten Password</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="password"
              label="Password"
              margin="normal"
              className={classes.textField}
              value={password}
              onChange={this.handlePasswordChange}
              helperText={passwordHelperText}
              type="password"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              margin="normal"
              className={classes.textField}
              value={confirmPassword}
              onChange={this.handleConfirmPasswordChange}
              helperText={confirmPasswordHelperText}
              type="password"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              className={classes.submitButton}
              disabled={disabled}
              variant="outlined"
              color="primary"
              onClick={this.handleSubmit}>
              Set Password
            </Button>
          </Grid>
        </Grid>
      </section>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    duration: state.resetPassword.duration,
    token: getResetPasswordToken(state, props)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetPasswordComplete: (token, password, history) =>
      dispatch(ResetPasswordActions.resetPasswordComplete(token, password, history))
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ResetPasswordSubmitPage)
  )
)
