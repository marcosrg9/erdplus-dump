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
import DiagramActions from "../redux/Diagram"
import EditActions from "../redux/Edit"
import Grid from "@material-ui/core/Grid"

const styles = theme => ({
  dialog: {},
  input: {
    width: 500
  }
})

const MaxWidth = 12000
const MaxHeight = 12000

class CanvasSizeDialog extends Component {
  state = {
    width: this.props.canvasWidth,
    height: this.props.canvasHeight
  }

  handleCancel = () => {
    this.props.hideCanvasSizeDialog()
  }

  handleSubmit = () => {
    const { width, height } = this.state
    this.props.setCanvasSize(width, height)
  }

  handleWidthChange = event => {
    this.setState({
      width: event.target.value
    })
  }

  handleHeightChange = event => {
    this.setState({
      height: event.target.value
    })
  }

  render() {
    const { showCanvasSizeDialog, classes } = this.props

    const minWidth = Math.max(this.props.minCanvasWidth, 200)
    const width = parseInt(this.state.width, 10)
    let validWidth = true
    let widthError = " "

    if (isNaN(width)) {
      validWidth = false
    } else if (width < minWidth) {
      validWidth = false
      widthError = `Must be at least ${minWidth}`
    } else if (width > MaxWidth) {
      validWidth = false
      widthError = `Must be less than ${MaxWidth}`
    }

    const minHeight = Math.max(this.props.minCanvasHeight, 200)
    const height = parseInt(this.state.height, 10)
    let validHeight = true
    let heightError = " "

    if (isNaN(height)) {
      validHeight = false
    } else if (height < minHeight) {
      validHeight = false
      heightError = `Must be at least ${minHeight}`
    } else if (height > MaxHeight) {
      validHeight = false
      heightError = `Must be less than ${MaxHeight}`
    }

    return (
      <Dialog
        open={showCanvasSizeDialog}
        aria-labelledby="canvas-size-dialog"
        onEscapeKeyDown={this.handleCancel}
        className={classes.dialog}>
        <DialogTitle id="canvas-size-dialog">Canvas Size</DialogTitle>
        <DialogContent>
          <DialogContentText>Canvas Size.</DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                id="width"
                label="Width"
                margin="normal"
                autoComplete="off"
                helperText={widthError}
                error={!validWidth}
                value={this.state.width}
                onChange={this.handleWidthChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="height"
                label="Height"
                margin="normal"
                autoComplete="off"
                helperText={heightError}
                error={!validHeight}
                value={this.state.height}
                onChange={this.handleHeightChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel (ESC)
          </Button>
          <Button onClick={this.handleSubmit} color="primary" disabled={!(validWidth && validHeight)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => {
  return {
    canvasWidth: state.edit.canvasWidth,
    canvasHeight: state.edit.canvasHeight,
    minCanvasWidth: state.edit.minCanvasWidth,
    minCanvasHeight: state.edit.minCanvasHeight,
    showCanvasSizeDialog: state.edit.showCanvasSizeDialog
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createDiagramDialogCancel: () => dispatch(DiagramActions.createDiagramDialogCancel()),
    createDiagram: diagram => dispatch(DiagramActions.createDiagram(diagram)),
    setCanvasSize: (width, height) => dispatch(EditActions.setCanvasSize(width, height)),
    hideCanvasSizeDialog: () => dispatch(EditActions.hideCanvasSizeDialog())
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog()(CanvasSizeDialog))
)
