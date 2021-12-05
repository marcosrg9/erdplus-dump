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

class EditFolderDialog extends Component {
  handleCancel = () => {
    this.props.editFolderDialogCancel()
  }

  handleSubmit = () => {
    const folder = {
      ...this.props.editFolder,
      name: this.props.editFolderNewName
    }
    this.props.renameFolder(folder)
  }

  editFolderNameChanged = event => {
    this.props.editFolderNameChanged(event.target.value)
  }

  render() {
    const { showEditFolder, editFolderNewName, classes } = this.props

    return (
      <Dialog
        open={showEditFolder}
        aria-labelledby="edit-folder-dialog"
        onEscapeKeyDown={this.handleCancel}
        className={classes.dialog}>
        <DialogTitle id="edit-folder-dialog">Rename Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={editFolderNewName}
            onChange={this.editFolderNameChanged}
            className={classes.input}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel (ESC)
          </Button>
          <Button onClick={this.handleSubmit} color="primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => {
  return {
    editFolder: state.folder.folders.find(f => f.id === state.folder.editFolderId),
    showEditFolder: state.folder.showEditFolder,
    editFolderNewName: state.folder.editFolderNewName,
    editFolderId: state.folder.editFolderId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editFolderDialogCancel: () => dispatch(FolderActions.editFolderDialogCancel()),
    renameFolder: folder => dispatch(FolderActions.renameFolder(folder)),
    editFolderNameChanged: name => dispatch(FolderActions.editFolderNameChanged(name))
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog()(EditFolderDialog))
)
