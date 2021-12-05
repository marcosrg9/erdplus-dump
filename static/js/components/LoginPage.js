import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import AuthActions from "../redux/Auth"
import Header from "./Header"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { Link } from "react-router-dom"
import { withRouter } from "react-router-dom"
import ReactGA from "react-ga"

const gapi = window.gapi

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
  },
  loginButton: {
    margin: theme.spacing(1),
    width: 250
  },
  socialButtonImage: {
    height: 24,
    marginRight: 5,
    backgroundColor: "#ffffff"
  }
})

class LoginPage extends Component {
  state = {
    email: "",
    password: ""
  }

  componentDidMount = () => {
    ReactGA.pageview("/login")

    gapi.load("auth2", () => {
      const auth2 = gapi.auth2.init({
        client_id: "935519046542-t7la3ci754e31p6lot2mo9r36mq5d2d4.apps.googleusercontent.com"
      })

      auth2.attachClickHandler(
        "google-login",
        {},
        user => {
          const idToken = user.getAuthResponse().id_token
          this.props.googleLogin(idToken, this.props.history)
        },
        error => {
          console.log(error)
        }
      )
    })
  }

  handleEmailChange = event => {
    this.setState({
      email: event.target.value
    })
  }

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value
    })
  }

  handleSubmit = () => {
    const { email, password } = this.state
    this.props.login(email, password, this.props.history)
  }

  catchReturn = ev => {
    if (ev.key === "Enter") {
      ev.preventDefault()

      const { email, password } = this.state
      if (email && password) {
        this.handleSubmit()
      }
    }
  }

  render() {
    const { email, password } = this.state

    const { classes } = this.props

    const disabled = !email || !password

    return (
      <section className={classes.section}>
        <Header />
        <Grid container className={classes.grid} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4">Login</Typography>
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
          <Grid item xs={12}>
            <TextField
              id="password"
              label="Password"
              margin="normal"
              className={classes.textField}
              value={password}
              onChange={this.handlePasswordChange}
              type="password"
              onKeyPress={this.catchReturn}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              className={classes.loginButton}
              disabled={disabled}
              variant="outlined"
              color="primary"
              onClick={this.handleSubmit}>
              Login
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button component={Link} to="/create-account">
              Create Account
            </Button>
            <Button component={Link} to="/forgot-password">
              Forgot Password
            </Button>
          </Grid>
          <Grid item xs={12}>
            <p>New users are encouraged to create an account with an email and password.</p>
            <Button id="google-login" variant="outlined" className={classes.loginButton}>
              <img alt="Google Logo" src="g-logo.png" className={classes.socialButtonImage} />
              Signin with Google
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
    login: (email, password, history) => dispatch(AuthActions.login(email, password, history)),
    googleLogin: (idToken, history) => dispatch(AuthActions.googleLogin(idToken, history))
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(LoginPage)
  )
)
