import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { getEditDiagram } from "../selectors/diagramsSelector"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"
import EditActions from "../redux/Edit"
import { withRouter } from "react-router-dom"
import Undo from "@material-ui/icons/Undo"
import Redo from "@material-ui/icons/Redo"
import Delete from "@material-ui/icons/Delete"
import MenuIcon from "@material-ui/icons/Menu"
import Save from "@material-ui/icons/Save"

const erd = window.erd

const styles = theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginBottom: 0,
    marginLeft: theme.spacing(1),
    marginRight: 0
  },
  buttonBar: {
    background: "#eeeeee",
    paddingBottom: 10,
    zIndex: 1000
  }
})

const buttonConfig = {
  none: [],

  er: [
    {
      name: "Select",
      mouseMode: "select"
    },
    {
      name: "Connect",
      mouseMode: "connect"
    },
    {
      name: "Entity",
      mouseMode: "entity"
    },
    {
      name: "Attribute",
      mouseMode: "attribute"
    },
    {
      name: "Relationship",
      mouseMode: "relationship"
    },
    {
      name: "Label",
      mouseMode: "label"
    }
  ],

  relational: [
    {
      name: "Select",
      mouseMode: "select"
    },
    {
      name: "Connect",
      mouseMode: "connect"
    },
    {
      name: "Table",
      mouseMode: "table"
    },
    {
      name: "Label",
      mouseMode: "label"
    }
  ],

  star: [
    {
      name: "Select",
      mouseMode: "select"
    },
    {
      name: "Connect",
      mouseMode: "connect"
    },
    {
      name: "Fact",
      mouseMode: "fact"
    },
    {
      name: "Dimension",
      mouseMode: "dimension"
    },
    {
      name: "Label",
      mouseMode: "label"
    }
  ]
}

class ButtonBar extends Component {
  state = {
    menuAnchor: null
  }

  handleUndo = () => {
    const stage = this.props.getStage()
    this.props.clearContext()
    stage.undoManager.undo()
  }

  handleRedo = () => {
    const stage = this.props.getStage()
    this.props.clearContext()
    stage.undoManager.redo()
  }

  handleDelete = () => {
    const stage = this.props.getStage()
    stage.deleteSelection()
    stage.draw()
  }

  changeMode = mouseMode => {
    const stage = this.props.getStage()
    const { setMouseMode } = this.props

    if (stage.undoManager.hasCurrentAction()) {
      stage.undoManager.endAction()
    }

    stage.mouseMode = mouseMode
    setMouseMode(mouseMode)
  }

  handleMenuClick = target => {
    this.setState({
      menuAnchor: target
    })
  }

  handleMenuClose = () => {
    this.setState({
      menuAnchor: null
    })
  }

  handleExportImage = () => {
    const { showExportImageDialog, createExportImageData, exportImageTransparent, exportImageScale } = this.props

    const stage = this.props.getStage()
    const diagramContent = new erd.DiagramArchive(stage).toJson()
    showExportImageDialog(diagramContent)
    createExportImageData(diagramContent, exportImageTransparent, exportImageScale)

    this.handleMenuClose()
  }

  handleResize = () => {
    const bounds = this.props.getStage().getBounds(false)
    this.props.showCanvasSizeDialog(bounds.right, bounds.bottom)
    this.setState({
      menuAnchor: null
    })
  }

  render() {
    const { menuAnchor } = this.state

    const { classes, diagramType, mouseMode, canUndo, canRedo, canDelete, isDirty } = this.props

    const buttons = buttonConfig[diagramType]

    return (
      <div className={classes.buttonBar}>
        <Menu id="diagram-menu" open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={this.handleMenuClose}>
          <MenuItem onClick={this.handleExportImage}>Export Image ...</MenuItem>
          {/* <MenuItem>Export Diagram File (TODO)...</MenuItem> */}
          <MenuItem onClick={this.handleRename}>Rename ...</MenuItem>
          {/* <MenuItem>Export SQL (TODO)...</MenuItem> */}
          <MenuItem onClick={this.handleResize}>Canvas Size ...</MenuItem>
        </Menu>
        <Button
          variant="outlined"
          className={classes.button}
          onClick={event => this.handleMenuClick(event.currentTarget)}>
          <MenuIcon /> Menu
        </Button>
        <Button variant="outlined" className={classes.button} onClick={this.props.handleSave} disabled={!isDirty}>
          <Save /> Save
        </Button>
        <Button variant="outlined" className={classes.button} onClick={this.handleUndo} disabled={!canUndo}>
          <Undo /> Undo
        </Button>
        <Button variant="outlined" className={classes.button} onClick={this.handleRedo} disabled={!canRedo}>
          <Redo /> Redo
        </Button>
        <Button variant="outlined" className={classes.button} onClick={this.handleDelete} disabled={!canDelete}>
          <Delete /> Delete
        </Button>

        {buttons.map(b => (
          <Button
            key={b.mouseMode}
            variant="outlined"
            className={classes.button}
            color={b.mouseMode === mouseMode ? "primary" : "default"}
            onClick={() => this.changeMode(b.mouseMode)}>
            {b.name}
          </Button>
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    mouseMode: state.edit.mouseMode,
    editDiagram: getEditDiagram(state, props),
    canUndo: state.edit.canUndo,
    canRedo: state.edit.canRedo,
    canDelete: state.edit.canDelete,
    exportImageTransparent: state.edit.exportImageTransparent,
    exportImageScale: state.edit.exportImageScale,
    isDirty: state.edit.isDirty
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clearContext: () => dispatch(EditActions.clearContext()),
    setMouseMode: mouseMode => dispatch(EditActions.setMouseMode(mouseMode)),
    showCanvasSizeDialog: (minCanvasWidth, minCanvasHeight) =>
      dispatch(EditActions.showCanvasSizeDialog(minCanvasWidth, minCanvasHeight)),
    showExportImageDialog: diagramContent => dispatch(EditActions.showExportImageDialog(diagramContent)),
    createExportImageData: (diagramContent, transparent, scale) =>
      dispatch(EditActions.createExportImageData(diagramContent, transparent, scale))
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ButtonBar)
  )
)
