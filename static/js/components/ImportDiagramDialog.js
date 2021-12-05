import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import DiagramActions from "../redux/Diagram"
import Grid from "@material-ui/core/Grid"
import Dropzone from "react-dropzone"
import Typography from "@material-ui/core/Typography"
import UploadMultiple from "mdi-material-ui/UploadMultiple"
import CheckCircleOutline from "mdi-material-ui/CheckCircleOutline"
import MinusCircleOutline from "mdi-material-ui/MinusCircleOutline"
import Chip from "@material-ui/core/Chip"
import Avatar from "@material-ui/core/Avatar"

const styles = theme => ({
  dropzone: {
    height: 250,
    width: 500,
    borderWidth: 2,
    borderColor: "#999999",
    borderStyle: "dashed",
    borderRadius: 5
  },
  list: {
    maxHeight: 200,
    overflowY: "auto"
  },
  chip: {
    margin: 5
  }
})

class ImportDiagramDialog extends Component {
  handleCancel = () => {
    this.props.importDiagramDialogCancel()
  }

  handleSubmit = () => {
    const { dropImportFileResults, importDiagrams } = this.props

    const diagrams = dropImportFileResults.filter(f => f.ok).map(f => f.diagram)
    importDiagrams(diagrams)
  }

  handleOnDrop = acceptedFiles => {
    const { dropImportFile, currentFolderId } = this.props

    acceptedFiles.forEach(file => {
      dropImportFile(file, currentFolderId)
    })
  }

  handleDeleteChip = index => {
    this.props.removeImportFile(index)
  }

  render() {
    const { showImportDiagramDialog, dropImportFileResults, standalone, classes } = this.props

    const canImport = dropImportFileResults.length > 0

    const title = standalone ? "Import New Diagram" : "Import New Diagrams"
    const hint = standalone
      ? "Drag and drop file here or click to browse for a file"
      : "Drag and drop multiple files here or click to browse for a file"

    return (
      <Dialog
        open={showImportDiagramDialog}
        aria-labelledby="import-diagram-dialog"
        onEscapeKeyDown={this.handleCancel}>
        <DialogTitle id="import-diagram-dialog">{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Dropzone onDrop={this.handleOnDrop} className={classes.dropzone} multiple={!standalone}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography align="center" variant="body2">
                      {hint}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} align="center">
                    <UploadMultiple />
                  </Grid>
                  <Grid item xs={12} align="center">
                    {dropImportFileResults.map((fileResult, index) => {
                      const avatarIcon = fileResult.ok ? (
                        <Avatar>
                          <CheckCircleOutline />
                        </Avatar>
                      ) : (
                        <Avatar>
                          <MinusCircleOutline />
                        </Avatar>
                      )
                      return (
                        <Chip
                          key={index}
                          label={fileResult.name}
                          className={classes.chip}
                          onDelete={() => this.handleDeleteChip(index)}
                          avatar={avatarIcon}
                        />
                      )
                    })}
                  </Grid>
                </Grid>
              </Dropzone>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel (ESC)
          </Button>
          <Button onClick={this.handleSubmit} color="primary" disabled={!canImport}>
            Import
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => {
  return {
    showImportDiagramDialog: state.diagram.showImportDiagramDialog,
    dropImportFileResults: state.diagram.dropImportFileResults,
    currentFolderId: state.folder.currentFolderId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    importDiagramDialogCancel: () => dispatch(DiagramActions.importDiagramDialogCancel()),
    dropImportFile: (file, folderId) => dispatch(DiagramActions.dropImportFile(file, folderId)),
    removeImportFile: index => dispatch(DiagramActions.removeImportFile(index))
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog()(ImportDiagramDialog))
)
