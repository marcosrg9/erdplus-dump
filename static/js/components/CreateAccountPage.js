import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Header from "./Header"
import TextField from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import CreateAccount from "../redux/Account"
import { withRouter } from "react-router-dom"
import ReactGA from "react-ga"

const styles = theme => ({
  textField: {
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

class CreateAccountPage extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isPasswordDirty: false,
    isConfirmPasswordDirty: false
  }

  componentDidMount() {
    ReactGA.pageview("/create-account")
  }

  handleSubmit = () => {
    const { name, email, password } = this.state
    this.props.createAccount(name, email, password, this.props.history)
  }

  handleNameChange = event => {
    this.setState({
      name: event.target.value
    })
  }

  handleEmailChange = event => {
    this.setState({
      email: event.target.value
    })
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

  render() {
    const { name, email, password, confirmPassword, isPasswordDirty, isConfirmPasswordDirty } = this.state

    const { classes } = this.props

    const disabled = !name || !email || !password || password.length < 8 || password !== confirmPassword

    const passwordHelperText = isPasswordDirty && password.length < 8 ? "Password must be longer than 8 characters" : ""
    const confirmPasswordHelperText =
      isConfirmPasswordDirty && password !== confirmPassword ? "Passwords do not match" : ""

    return (
      <section className={classes.section}>
        <Header />
        <Grid container className={classes.grid} spacing={24}>
          <Grid item xs={12}>
            <Typography variant="h4">Create Account</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="name"
              label="Name"
              margin="normal"
              className={classes.textField}
              value={name}
              onChange={this.handleNameChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email"
              label="Email"
              margin="normal"
              className={classes.textField}
              value={email}
              onChange={this.handleEmailChange}
            />
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
              variant="outlined"
              color="primary"
              disabled={disabled}
              onClick={this.handleSubmit}>
              Create Account
            </Button>
          </Grid>
        </Grid>
      </section>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    createAccount: (name, email, password, history) =>
      dispatch(CreateAccount.createAccount(name, email, password, history))
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(CreateAccountPage)
  )
)
