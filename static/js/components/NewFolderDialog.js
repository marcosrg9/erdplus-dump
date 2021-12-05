import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import FolderActions from "../redux/Folder"

const styles = theme => ({
  dialog: {},
  input: {
    width: 300
  }
})

class NewFolderDialog extends Component {
  handleCancel = () => {
    this.props.createFolderDialogCancel()
  }

  handleSubmit = () => {
    this.props.createFolder(this.props.newFolderName, this.props.currentFolderId)
  }

  newFolderNameChanged = event => {
    this.props.newFolderNameChanged(event.target.value)
  }

  render() {
    const { showNewFolder, newFolderName, classes } = this.props

    return (
      <Dialog
        open={showNewFolder}
        aria-labelledby="new-folder-dialog"
        onEscapeKeyDown={this.handleCancel}
        className={classes.dialog}>
        <DialogTitle id="new-folder-dialog">Create New Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a new folder.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={newFolderName}
            onChange={this.newFolderNameChanged}
            className={classes.input}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel (ESC)
          </Button>
          <Button onClick={this.handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => {
  return {
    showNewFolder: state.folder.showNewFolder,
    newFolderName: state.folder.newFolderName,
    currentFolderId: state.folder.currentFolderId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createFolderDialogCancel: () => dispatch(FolderActions.createFolderDialogCancel()),
    createFolder: (name, parentId) => dispatch(FolderActions.createFolder(name, parentId)),
    newFolderNameChanged: newFolderName => dispatch(FolderActions.newFolderNameChanged(newFolderName))
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog()(NewFolderDialog))
)
