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
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import Grid from "@material-ui/core/Grid"

const styles = theme => ({
  dialog: {},
  input: {
    width: 500
  }
})

const DiagramTypes = {
  Erd: "er",
  Relational: "relational",
  Star: "star"
}

class NewDiagramDialog extends Component {
  handleCancel = () => {
    this.props.createDiagramDialogCancel()
  }

  handleSubmit = () => {
    const { currentFolderId, createDiagramName, createDiagramType } = this.props

    const defaultContent = {
      version: 2,
      www: "erdplus.com",
      shapes: [],
      connectors: [],
      width: 2000,
      height: 1000
    }

    const diagram = {
      folderId: currentFolderId,
      name: createDiagramName,
      diagramType: createDiagramType,
      content: JSON.stringify(defaultContent)
    }
    this.props.createDiagram(diagram)
  }

  handleNameChanged = event => {
    this.props.setCreateDiagramName(event.target.value)
  }

  handleTypeChange = event => {
    this.props.setCreateDiagramType(event.target.value)
  }

  render() {
    const { createDiagramName, createDiagramType, showCreateDiagramDialog, classes } = this.props

    return (
      <Dialog
        open={showCreateDiagramDialog}
        aria-labelledby="new-diagram-dialog"
        onEscapeKeyDown={this.handleCancel}
        className={classes.dialog}>
        <DialogTitle id="new-diagram-dialog">Create New Diagram</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a new diagram.</DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                value={createDiagramName}
                onChange={this.handleNameChanged}
                className={classes.input}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>Type</FormLabel>
                <RadioGroup value={createDiagramType} onChange={this.handleTypeChange}>
                  <FormControlLabel value={DiagramTypes.Erd} control={<Radio />} label="ER Diagram" />
                  <FormControlLabel value={DiagramTypes.Relational} control={<Radio />} label="Relational Schema" />
                  <FormControlLabel value={DiagramTypes.Star} control={<Radio />} label="Star Schema" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
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
    createDiagramName: state.diagram.createDiagramName,
    createDiagramType: state.diagram.createDiagramType,
    showCreateDiagramDialog: state.diagram.showCreateDiagramDialog,
    currentFolderId: state.folder.currentFolderId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createDiagramDialogCancel: () => dispatch(DiagramActions.createDiagramDialogCancel()),
    createDiagram: diagram => dispatch(DiagramActions.createDiagram(diagram)),
    setCreateDiagramName: name => dispatch(DiagramActions.setCreateDiagramName(name)),
    setCreateDiagramType: typ => dispatch(DiagramActions.setCreateDiagramType(typ))
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog()(NewDiagramDialog))
)
