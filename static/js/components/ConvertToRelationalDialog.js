import React from "react"
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
import ConvertActions from "../redux/Convert"
import Grid from "@material-ui/core/Grid"
import { withRouter } from "react-router-dom"

const styles = theme => ({
  dialog: {},
  input: {
    width: 500
  }
})

class ConvertToRelationalDialog extends React.Component{
  handleCancel = () => {
    this.props.hideConvertToRelationalDialog()
  }

  handleCreate = () => {
    const { diagram, name, convertToRelational, history } = this.props
    convertToRelational(diagram.folderId, name, diagram.content, false, history)
  }

  handleEdit = () => {
    const { diagram, name, convertToRelational, history } = this.props
    convertToRelational(diagram.folderId, name, diagram.content, true, history)
  }

  handleNameChanged = event => {
    const name = event.target.value
    this.props.nameChanged(name)
  }

  render() {
    const { showDialog, name, classes, autoFocusName } = this.props

    const nameTextField = input => {
      if (input && autoFocusName) {
        setTimeout(() => {
          input.focus()
          input.select()
        }, 0)
      }
    }

    return (
      <Dialog
        open={showDialog}
        aria-labelledby="convert-diagram-dialog"
        onEscapeKeyDown={this.handleCancel}
        className={classes.dialog}>
        <DialogTitle id="convert-diagram-dialog">Convert to Relational Schema</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The relational diagram will be created in the same folder as this ER diagram.
          </DialogContentText>
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
                value={name}
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
          <Button onClick={this.handleCreate} color="primary">
            Create
          </Button>
          <Button onClick={this.handleEdit} color="primary">
            Create & Edit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => {
  const diagramId = state.convert.diagramId
  const diagram = state.diagram.diagrams.find(d => d.id === diagramId)
  return {
    diagram,
    showDialog: state.convert.showDialog,
    autoFocusName: state.convert.autoFocusName,
    name: state.convert.name
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideConvertToRelationalDialog: () => dispatch(ConvertActions.hideConvertToRelationalDialog()),
    nameChanged: name => dispatch(ConvertActions.nameChanged(name)),
    convertToRelational: (folderId, name, content, edit, history) =>
      dispatch(ConvertActions.convertToRelational(folderId, name, content, edit, history))
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withMobileDialog()(ConvertToRelationalDialog))
  )
)
