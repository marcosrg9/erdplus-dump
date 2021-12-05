import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"
import EditActions from "../redux/Edit"
import DiagramActions from "../redux/Diagram"
import { withRouter } from "react-router-dom"
import Undo from "@material-ui/icons/Undo"
import Redo from "@material-ui/icons/Redo"
import Delete from "@material-ui/icons/Delete"
import MenuIcon from "@material-ui/icons/Menu"

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

class StandaloneButtonBar extends Component {
  state = {
    menuAnchor: null
  }

  handleSave = () => {
    const { saveDiagram, editDiagram } = this.props

    const stage = this.props.getStage()
    const archive = new erd.DiagramArchive(stage)

    const diagram = { ...editDiagram, content: archive.toJson() }
    saveDiagram(diagram)
    this.handleMenuClose()
  }

  handleImport = () => {
    this.props.importDiagramDialogShow()
    this.handleMenuClose()
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

  newERDiagram = () => {
    this.handleMenuClose()
    this.props.newERDiagram()
  }

  newRelationalSchema = () => {
    this.handleMenuClose()
    this.props.newRelationalSchema()
  }

  newStarSchema = () => {
    this.handleMenuClose()
    this.props.newStarSchema()
  }

  render() {
    const { menuAnchor } = this.state

    const { classes, diagramType, mouseMode, canUndo, canRedo, canDelete } = this.props

    const buttons = buttonConfig[diagramType]

    return (
      <div className={classes.buttonBar}>
        <Menu id="diagram-menu" open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={this.handleMenuClose}>
          <MenuItem onClick={this.newERDiagram}>New ER Diagram</MenuItem>
          <MenuItem onClick={this.newRelationalSchema}>New Relational Schema</MenuItem>
          <MenuItem onClick={this.newStarSchema}>New Star Schema</MenuItem>
          <hr />
          <MenuItem onClick={this.handleSave}>Export ...</MenuItem>
          <MenuItem onClick={this.handleImport}>Import ...</MenuItem>
          <hr />
          <MenuItem onClick={this.handleExportImage}>Export Image ...</MenuItem>
          <MenuItem onClick={this.handleResize}>Canvas Size ...</MenuItem>
        </Menu>

        <Button
          variant="outlined"
          className={classes.button}
          onClick={event => this.handleMenuClick(event.currentTarget)}>
          <MenuIcon /> Menu
        </Button>

        {diagramType !== "none" && (
          <Button variant="outlined" className={classes.button} onClick={this.handleUndo} disabled={!canUndo}>
            <Undo /> Undo
          </Button>
        )}
        {diagramType !== "none" && (
          <Button variant="outlined" className={classes.button} onClick={this.handleRedo} disabled={!canRedo}>
            <Redo /> Redo
          </Button>
        )}
        {diagramType !== "none" && (
          <Button variant="outlined" className={classes.button} onClick={this.handleDelete} disabled={!canDelete}>
            <Delete /> Delete
          </Button>
        )}

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
    exportImageTransparent: state.edit.exportImageTransparent,
    exportImageScale: state.edit.exportImageScale
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showExportImageDialog: diagramContent => dispatch(EditActions.showExportImageDialog(diagramContent)),
    createExportImageData: (diagramContent, transparent, scale) =>
      dispatch(EditActions.createExportImageData(diagramContent, transparent, scale)),
    importDiagramDialogShow: () => dispatch(DiagramActions.importDiagramDialogShow())
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(StandaloneButtonBar)
  )
)
