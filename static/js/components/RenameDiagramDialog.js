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
import Grid from "@material-ui/core/Grid"

const styles = theme => ({
  dialog: {},
  input: {
    width: 500
  }
})

class RenameDiagramDialog extends Component {
  handleCancel = () => {
    this.props.renameDiagramDialogCancel()
  }

  handleSubmit = () => {
    const { diagram, renameDiagramName, renameDiagramDialogCancel, saveDiagram } = this.props

    const updatedDiagram = {
      ...diagram,
      name: renameDiagramName
    }
    renameDiagramDialogCancel()
    saveDiagram(updatedDiagram)
  }

  handleNameChanged = event => {
    const name = event.target.value
    this.props.renameDiagramNameChanged(name)
  }

  render() {
    const { showRenameDiagramDialog, renameDiagramName, classes } = this.props

    const nameTextField = input => {
      // BUG: Autofocus doesn"t seem to work here when also closing the diagram menu in DiagramList.
      //
      // if (input) {
      //   setTimeout(() => {
      //     input.focus()
      //     input.select()
      //     }, 0)
      // }
    }

    return (
      <Dialog
        open={showRenameDiagramDialog}
        aria-labelledby="rename-diagram-dialog"
        onEscapeKeyDown={this.handleCancel}
        className={classes.dialog}>
        <DialogTitle id="rename-diagram-dialog">Rename New Diagram</DialogTitle>
        <DialogContent>
          <DialogContentText>Rename a new diagram.</DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                inputProps={{ ref: nameTextField }}
                value={renameDiagramName}
                onChange={this.handleNameChanged}
                className={classes.input}
              />
            </Grid>
          </Grid>
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
  const renameDiagramId = state.diagram.renameDiagramId
  const diagram = state.diagram.diagrams.find(d => d.id === renameDiagramId)
  return {
    showRenameDiagramDialog: state.diagram.showRenameDiagramDialog,
    renameDiagramName: state.diagram.renameDiagramName,
    renameDiagramId,
    diagram
  }
}

const mapDispatchToProps = dispatch => {
  return {
    renameDiagramDialogCancel: () => dispatch(DiagramActions.renameDiagramDialogCancel()),
    renameDiagramNameChanged: name => dispatch(DiagramActions.renameDiagramNameChanged(name)),
    saveDiagram: diagram => dispatch(DiagramActions.saveDiagram(diagram))
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog()(RenameDiagramDialog))
)
