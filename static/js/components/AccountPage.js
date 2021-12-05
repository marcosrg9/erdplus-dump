import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Header from "./Header"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import AccountActions from "../redux/Account"
import ReactGA from "react-ga"
import { Checkbox, FormControlLabel } from "@material-ui/core"
import { withRouter } from "react-router-dom"
import ErrorIcon from "@material-ui/icons/Error"

const styles = theme => ({
  section: {
    height: "100%",
    display: "flex",
    flexFlow: "column"
  },
  contentArea: {
    height: "100%"
  },
  grid: {
    paddingTop: theme.spacing(3),
    textAlign: "center"
  },
  paper: {
    padding: theme.spacing(3)
  },
  textField: {
    width: "100%"
  },
  buttonGridItem: {
    width: "100%",
    textAlign: "right"
  },
  button: {
    marginLeft: theme.spacing(1),
    width: 120
  }
})

class AccountPage extends Component {
  state = {
    currentPassword: "",
    newPassword: "",
    newPassword2: "",
    isCurrentPasswordDirty: false,
    isNewPasswordDirty: false,
    isNewPassword2Dirty: false,
    migrateEmail: "",
    isMigrateEmailDirty: false
  }

  static getDerivedStateFromProps(props, state) {
    if (typeof props.account.email === "string" && state.migrateEmail !== props.account.email) {
      return {
        migrateEmail: props.account.email
      }
    }
    return null
  }

  componentDidMount() {
    ReactGA.pageview("/account")
  }

  handleEditName = () => {
    this.props.editName()
  }

  handleNameChange = event => {
    const name = event.target.value
    this.props.updateTemporaryName(name)
  }

  handleCancelEditName = () => {
    this.props.cancelEditName()
  }

  handleSaveEditName = () => {
    const { temporaryName, updateAccount } = this.props
    updateAccount(temporaryName)
  }

  handleChangePassword = () => {
    this.setState({
      currentPassword: "",
      newPassword: "",
      newPassword2: "",
      isCurrentPasswordDirty: false,
      isNewPasswordDirty: false,
      isNewPassword2Dirty: false
    })
    this.props.editPassword()
  }

  handleCancelChangePassword = () => {
    this.props.cancelEditPassword()
  }

  handleSaveChangePassword = () => {
    const { currentPassword, newPassword } = this.state
    this.props.changePassword(currentPassword, newPassword)
  }

  handleCurrentPasswordChange = event => {
    this.setState({
      currentPassword: event.target.value,
      isCurrentPasswordDirty: true
    })
  }

  handleNewPasswordChange = event => {
    this.setState({
      newPassword: event.target.value,
      isNewPasswordDirty: true
    })
  }

  handleNewPassword2Change = event => {
    this.setState({
      newPassword2: event.target.value,
      isNewPassword2Dirty: true
    })
  }

  handleMigrateEmailChange = event => {
    this.setState({
      migrateEmail: event.target.value,
      isMigrateEmailDirty: true
    })
  }

  handleSocialMigration = () => {
    const { migrateEmail, newPassword } = this.state
    this.props.doSocialMigration(migrateEmail, newPassword, this.props.history)
  }

  handleConfirmDeleteChanged = () => {
    const { confirmDeleteAccount, changeConfirmDeleteAccount } = this.props
    changeConfirmDeleteAccount(!confirmDeleteAccount)
  }

  deleteAccount = () => {
    this.props.deleteAccount(this.props.history)
  }

  render() {
    const { classes, name, temporaryName, showEditName, showEditPassword, confirmDeleteAccount } = this.props

    const { identity } = this.props.session

    // Email identity
    let emailIdentityBlock = null
    if (this.props.account.email) {
      const email = this.props.account.email
      const {
        currentPassword,
        newPassword,
        newPassword2,
        isCurrentPasswordDirty,
        isNewPasswordDirty,
        isNewPassword2Dirty
      } = this.state

      const disableSavePassword = !currentPassword || newPassword.length < 8 || newPassword !== newPassword2
      const currentPasswordHelperText =
        isCurrentPasswordDirty && currentPassword.length === 0 ? "Enter current password" : ""
      const newPasswordHelperText =
        isNewPasswordDirty && newPassword.length < 8 ? "Password must be longer than 8 characters" : ""
      const newPassword2HelperText = isNewPassword2Dirty && newPassword !== newPassword2 ? "Passwords do not match" : ""

      emailIdentityBlock = (
        <Grid container className={classes.grid} spacing={3}>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={2}>
              <Grid container className={classes.grid} spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Change Password</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">{email}</Typography>
                </Grid>
                {showEditPassword && (
                  <Grid item xs={12}>
                    <TextField
                      id="currentPassword"
                      label="Current Password"
                      margin="normal"
                      className={classes.textField}
                      type="password"
                      helperText={currentPasswordHelperText}
                      value={currentPassword}
                      onChange={this.handleCurrentPasswordChange}
                    />
                  </Grid>
                )}
                {showEditPassword && (
                  <Grid item xs={12}>
                    <TextField
                      id="newPassword"
                      label="New Password"
                      margin="normal"
                      className={classes.textField}
                      type="password"
                      helperText={newPasswordHelperText}
                      value={newPassword}
                      onChange={this.handleNewPasswordChange}
                    />
                  </Grid>
                )}
                {showEditPassword && (
                  <Grid item xs={12}>
                    <TextField
                      id="newPassword2"
                      label="Confirm New Password"
                      margin="normal"
                      className={classes.textField}
                      type="password"
                      helperText={newPassword2HelperText}
                      value={newPassword2}
                      onChange={this.handleNewPassword2Change}
                    />
                  </Grid>
                )}
                <Grid item xs={12} className={classes.buttonGridItem}>
                  {!showEditPassword && (
                    <Button className={classes.button} variant="outlined" onClick={this.handleChangePassword}>
                      Change
                    </Button>
                  )}
                  {showEditPassword && (
                    <Button className={classes.button} variant="outlined" onClick={this.handleCancelChangePassword}>
                      Cancel
                    </Button>
                  )}
                  {showEditPassword && (
                    <Button
                      className={classes.button}
                      variant="outlined"
                      color="primary"
                      onClick={this.handleSaveChangePassword}
                      disabled={disableSavePassword}>
                      Save
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      )
    }

    // Google identity
    let googleIdentityBlock = null
    if (this.props.account.googleId) {
      googleIdentityBlock = (
        <Grid container className={classes.grid} spacing={3}>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={2}>
              <Grid container className={classes.grid} spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Logged in with Google</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">{this.props.account.googleId}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      )
    }

    return (
      <section className={classes.section}>
        <Header />

        <Grid container className={classes.grid} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4">Account Information</Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.grid} spacing={3}>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={2}>
              <Grid container className={classes.grid} spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Name</Typography>
                </Grid>
                <Grid item xs={12}>
                  {!showEditName && <Typography variant="body1">{name}</Typography>}
                  {showEditName && (
                    <TextField
                      id="name"
                      margin="normal"
                      className={classes.textField}
                      value={temporaryName}
                      onChange={this.handleNameChange}
                    />
                  )}
                </Grid>
                <Grid item xs={12} className={classes.buttonGridItem}>
                  {!showEditName && (
                    <Button className={classes.button} variant="outlined" onClick={this.handleEditName}>
                      Edit
                    </Button>
                  )}
                  {showEditName && (
                    <Button className={classes.button} variant="outlined" onClick={this.handleCancelEditName}>
                      Cancel
                    </Button>
                  )}
                  {showEditName && (
                    <Button
                      className={classes.button}
                      variant="outlined"
                      color="primary"
                      onClick={this.handleSaveEditName}>
                      Save
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={3} />
        </Grid>

        {identity === "email" && emailIdentityBlock}
        {identity === "google" && googleIdentityBlock}

        <Grid container className={classes.grid} spacing={3}>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={2}>
              <Grid container className={classes.grid} spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Delete Account</Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={confirmDeleteAccount} onChange={this.handleConfirmDeleteChanged} />}
                    label="Permanently delete account. The account will be deleted as soon as you press 'Delete' below."
                  />
                </Grid>
                <Grid item xs={12} className={classes.buttonGridItem}>
                  {!showEditName && (
                    <Button
                      className={classes.button}
                      color="primary"
                      variant={confirmDeleteAccount ? "contained" : "outlined"}
                      disabled={!confirmDeleteAccount}
                      onClick={this.deleteAccount}>
                      Delete
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      </section>
    )
  }
}

const mapStateToProps = state => {
  return {
    name: state.account.name,
    temporaryName: state.account.temporaryName,
    showEditName: state.account.showEditName,
    showEditPassword: state.account.showEditPassword,
    createdAt: state.account.createdAt,
    account: state.account.account,
    session: state.auth.session,
    confirmDeleteAccount: state.account.confirmDeleteAccount
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editName: () => dispatch(AccountActions.editName()),
    updateTemporaryName: temporaryName => dispatch(AccountActions.updateTemporaryName(temporaryName)),
    cancelEditName: () => dispatch(AccountActions.cancelEditName()),
    updateAccount: name => dispatch(AccountActions.updateAccount(name)),
    editPassword: () => dispatch(AccountActions.editPassword()),
    changePassword: (currentPassword, newPassword) =>
      dispatch(AccountActions.changePassword(currentPassword, newPassword)),
    cancelEditPassword: () => dispatch(AccountActions.cancelEditPassword()),
    changeConfirmDeleteAccount: confirmDeleteAccount =>
      dispatch(AccountActions.changeConfirmDeleteAccount(confirmDeleteAccount)),
    deleteAccount: history => dispatch(AccountActions.deleteAccount(history)),
    doSocialMigration: (email, password, history) => dispatch(AccountActions.doSocialMigration(email, password, history))
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(AccountPage)
  )
)
