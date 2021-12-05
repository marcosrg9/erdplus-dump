import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import FolderActions from "../redux/Folder"

const styles = theme => ({
  dialog: {},
})

class DeleteFolderDialog extends Component {
  handleCancel = () => {
    this.props.deleteFolderDialogCancel()
  }

  handleSubmit = () => {
    this.props.deleteFolder(this.props.deleteFolderId)
  }

  render() {
    const { showDeleteFolder, deleteFolderName, classes } = this.props

    return (
      <Dialog
        open={showDeleteFolder}
        aria-labelledby="delete-folder-dialog"
        onEscapeKeyDown={this.handleCancel}
        className={classes.dialog}>
        <DialogTitle id="delete-folder-dialog">Delete Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete the folder named "{deleteFolderName}" and all subfolders?
            <p>Diagrams in the deleted folders will be deleted and <br />
            moved to the Trash folder.</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel (ESC)
          </Button>
          <Button onClick={this.handleSubmit} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

}

const mapStateToProps = state => {
  return {
    showDeleteFolder: state.folder.showDeleteFolder,
    deleteFolderName: state.folder.deleteFolderName,
    deleteFolderId: state.folder.deleteFolderId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteFolderDialogCancel: () => dispatch(FolderActions.deleteFolderDialogCancel()),
    deleteFolder: (folderId) => dispatch(FolderActions.deleteFolder(folderId))
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog()(DeleteFolderDialog))
)
