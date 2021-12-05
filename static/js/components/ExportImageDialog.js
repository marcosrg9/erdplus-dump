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
import EditActions from "../redux/Edit"
import Grid from "@material-ui/core/Grid"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"

const saveAs = window.saveAs

const styles = theme => ({
  dialog: {},
  input: {
    width: 500
  },
  canvas: {
    display: "none"
  },
  imageContainer: {
    width: 500,
    height: 250,
    overflow: "scroll",
    backgroundColor: "#eee",
    backgroundSize: "40px 40px",
    backgroundPosition: "0 0, 20px 20px",
    backgroundImage:
      "linear-gradient(45deg,#e0e0e0 25%,transparent 25%,transparent 75%,#e0e0e0 75%,#e0e0e0),linear-gradient(45deg,#e0e0e0 25%,transparent 25%,transparent 75%,#e0e0e0 75%,#e0e0e0)"
  },
  image: {}
})

class ExportImageDialog extends Component {
  handleCancel = () => {
    this.props.hideExportImageDialog()
  }

  handleSubmit = () => {
    const r = saveAs(this.props.exportImageBlob, "image.png")
    this.props.hideExportImageDialog()
  }

  handleChangeTransparent = () => {
    const {
      updateExportImageOptions,
      createExportImageData,
      exportImageContent,
      exportImageTransparent,
      exportImageScale
    } = this.props
    updateExportImageOptions(!exportImageTransparent, exportImageScale)
    createExportImageData(exportImageContent, !exportImageTransparent, exportImageScale)
  }

  handleChangeScale = () => {
    const {
      updateExportImageOptions,
      createExportImageData,
      exportImageContent,
      exportImageTransparent,
      exportImageScale
    } = this.props
    const scale = exportImageScale === 1 ? 4 : 1
    updateExportImageOptions(exportImageTransparent, scale)
    createExportImageData(exportImageContent, exportImageTransparent, scale)
  }

  render() {
    const { showExportImageDialog, exportImageDataUrl, exportImageTransparent, exportImageScale, classes } = this.props

    return (
      <Dialog
        open={showExportImageDialog}
        aria-labelledby="canvas-size-dialog"
        onEscapeKeyDown={this.handleCancel}
        className={classes.dialog}>
        <DialogTitle id="canvas-size-dialog">Export Image</DialogTitle>
        <DialogContent>
          <DialogContentText>Preview</DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div className={classes.imageContainer}>
                <img src={exportImageDataUrl} alt="diagram" className={classes.image} />
              </div>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={exportImageTransparent} onChange={this.handleChangeTransparent} />}
                label="Transparent Background"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={exportImageScale === 4} onChange={this.handleChangeScale} />}
                label="High Resolution (4x normal size)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel (ESC)
          </Button>
          <Button onClick={this.handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => {
  return {
    showExportImageDialog: state.edit.showExportImageDialog,
    exportImageDataUrl: state.edit.exportImageDataUrl,
    exportImageBlob: state.edit.exportImageBlob,
    exportImageContent: state.edit.exportImageContent,
    exportImageTransparent: state.edit.exportImageTransparent,
    exportImageScale: state.edit.exportImageScale
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideExportImageDialog: () => dispatch(EditActions.hideExportImageDialog()),
    createExportImageData: (diagramContent, transparent, scale) =>
      dispatch(EditActions.createExportImageData(diagramContent, transparent, scale)),
    updateExportImageOptions: (transparent, scale) => dispatch(EditActions.updateExportImageOptions(transparent, scale))
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog()(ExportImageDialog))
)
