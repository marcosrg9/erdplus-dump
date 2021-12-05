import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Header from "./Header"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import ResetPasswordActions from "../redux/ResetPassword"
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

class ResetPasswordRequest extends Component {
  state = {
    email: ""
  }

  catchReturn = ev => {
    if (ev.key === "Enter") {
      ev.preventDefault()
      this.handleSubmit()
    }
  }

  componentDidMount() {
    ReactGA.pageview("/forgot-password")
  }

  handleEmailChange = event => {
    this.setState({
      email: event.target.value
    })
  }

  handleSubmit = () => {
    const { email } = this.state
    if (email) {
      this.props.resetPasswordStart(email)
    }
  }

  render() {
    const { email } = this.state

    const { classes, forgotSuccess } = this.props

    const disabled = !email

    return (
      <section className={classes.section}>
        <Header />
        <Grid container className={classes.grid} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4">Forgot Password</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email"
              label="Email"
              margin="normal"
              className={classes.textField}
              value={email}
              onChange={this.handleEmailChange}
              onKeyPress={this.catchReturn}
            />
          </Grid>
          {!forgotSuccess && (
            <Grid item xs={12}>
              <Button
                className={classes.submitButton}
                disabled={disabled}
                variant="outlined"
                color="primary"
                onClick={this.handleSubmit}>
                Submit
              </Button>
            </Grid>
          )}
          {forgotSuccess && (
            <Grid item xs={12}>
              <Typography variant="body1">Check your email for the reset password link.</Typography>
            </Grid>
          )}
        </Grid>
      </section>
    )
  }
}

const mapStateToProps = state => {
  return {
    forgotSuccess: state.resetPassword.forgotSuccess
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetPasswordStart: email => dispatch(ResetPasswordActions.resetPasswordStart(email))
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ResetPasswordRequest)
  )
)
