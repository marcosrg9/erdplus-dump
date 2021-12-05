import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { getCurrentFolderDiagrams } from "../selectors/diagramsSelector"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import IconButton from "@material-ui/core/IconButton"
import File from "mdi-material-ui/File"
import DotsVertical from "mdi-material-ui/DotsVertical"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Divider from "@material-ui/core/Divider"
import DiagramActions from "../redux/Diagram"
import ConvertActions from "../redux/Convert"
import { withRouter } from "react-router-dom"
import Checkbox from "@material-ui/core/Checkbox"
import { getTrashFolderId } from "../selectors/foldersSelector"

const saveAs = window.saveAs

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  lastModified: {
    textAlign: "right",
    marginRight: 30
  }
})

const DiagramTypes = {
  Erd: "er",
  Relational: "relational",
  Star: "star"
}

class DiagramList extends Component {
  state = {
    menuAnchor: null,
    diagramId: null,
    diagramType: null,
    isMoving: false,
    selectedIds: []
  }

  handleClick = diagramId => {
    const { mode, onSelectDiagram, history, currentFolderId, trashFolderId } = this.props
    if (mode === "select") {
      onSelectDiagram(diagramId)
    } else {
      if (currentFolderId !== trashFolderId) {
        history.push(`/edit-diagram/${diagramId}`)
      }
    }
  }

  handleMenuClick = (target, diagramId, diagramType) => {
    this.setState({
      menuAnchor: target,
      diagramId,
      diagramType
    })
  }

  handleMenuClose = () => {
    this.setState({
      menuAnchor: null,
      diagramId: null,
      diagramType: null
    })
  }

  handleOpen = () => {
    this.handleClick(this.state.diagramId)
    this.handleMenuClose()
  }

  handleRename = () => {
    const diagram = this.props.currentFolderDiagrams.find(d => d.id === this.state.diagramId)
    this.handleMenuClose()
    this.props.renameDiagramDialogShow(diagram)
  }

  handleTrash = () => {
    const diagram = this.props.currentFolderDiagrams.find(d => d.id === this.state.diagramId)
    this.props.saveDiagram({
      ...diagram,
      folderId: this.props.trashFolderId
    })
    this.handleMenuClose()
  }

  handleCopy = () => {
    const diagram = this.props.currentFolderDiagrams.find(d => d.id === this.state.diagramId)
    const copy = {
      folderId: diagram.folderId,
      name: `${diagram.name} Copy`,
      diagramType: diagram.diagramType,
      content: diagram.content
    }
    this.props.createDiagram(copy)
    this.handleMenuClose()
  }

  handleExport = () => {
    const diagram = this.props.currentFolderDiagrams.find(d => d.id === this.state.diagramId)
    const blob = new Blob([diagram.content], { type: "text/plain;charset=utf-8" })
    saveAs(blob, `${diagram.name}.erdplus`)
    this.handleMenuClose()
  }

  handleConvertToRelational = () => {
    const diagram = this.props.currentFolderDiagrams.find(d => d.id === this.state.diagramId)
    this.handleMenuClose()
    this.props.showConvertToRelationalDialog(diagram.id, diagram.name)
  }

  handleGenerateSql = () => {
    const diagram = this.props.currentFolderDiagrams.find(d => d.id === this.state.diagramId)
    this.handleMenuClose()
    this.props.generateSql(diagram.content)
  }

  typeToName = diagramType => {
    if (diagramType === DiagramTypes.Erd) {
      return "ER Diagram"
    } else if (diagramType === DiagramTypes.Relational) {
      return "Relational Schema"
    } else if (diagramType === DiagramTypes.Star) {
      return "Star Schema"
    } else {
      return ""
    }
  }

  render() {
    const { menuAnchor, diagramType } = this.state

    const { currentFolderDiagrams, classes, mode, selectedIds, currentFolderId, trashFolderId } = this.props
    currentFolderDiagrams.sort((left, right) => {
      return left.name.localeCompare(right.name)
    })

    const isTrashFolder = currentFolderId === trashFolderId

    return (
      <List className={classes.root}>
        <Menu id="diagram-menu" open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={this.handleMenuClose}>
          <MenuItem onClick={this.handleOpen}>Open ...</MenuItem>
          <Divider />
          <MenuItem onClick={this.handleRename}>Rename ...</MenuItem>
          <MenuItem onClick={this.handleTrash}>Move to Trash</MenuItem>
          <MenuItem onClick={this.handleCopy}>Copy</MenuItem>
          <MenuItem onClick={this.handleExport}>Export</MenuItem>
          <MenuItem onClick={this.handleConvertToRelational} disabled={diagramType !== "er"}>
            Convert to Relational Schema
          </MenuItem>
          <MenuItem onClick={this.handleGenerateSql} disabled={diagramType === "er"}>
            Generate SQL
          </MenuItem>
        </Menu>
        {currentFolderDiagrams.map((diagram, i) => (
          <ListItem button={!isTrashFolder} key={diagram.id} onClick={() => this.handleClick(diagram.id)}>
            {mode === "select" && <Checkbox checked={selectedIds.includes(diagram.id)} tabIndex={i} />}
            <ListItemIcon>
              <File />
            </ListItemIcon>
            <ListItemText primary={diagram.name} secondary={this.typeToName(diagram.diagramType)} />
            <ListItemText secondary={window.moment(diagram.updatedAt).fromNow()} className={classes.lastModified} />

            {!isTrashFolder && (
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="diagram menu"
                  aria-owns={menuAnchor ? "diagram-menu" : null}
                  aria-haspopup="true"
                  onClick={event => this.handleMenuClick(event.currentTarget, diagram.id, diagram.diagramType)}>
                  <DotsVertical />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
      </List>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentFolderId: state.folder.currentFolderId,
    currentFolderDiagrams: getCurrentFolderDiagrams(state),
    trashFolderId: getTrashFolderId(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createDiagram: diagram => dispatch(DiagramActions.createDiagram(diagram)),
    deleteDiagram: diagramId => dispatch(DiagramActions.deleteDiagram(diagramId)),
    saveDiagram: diagram => dispatch(DiagramActions.saveDiagram(diagram)),
    renameDiagramDialogShow: diagramId => dispatch(DiagramActions.renameDiagramDialogShow(diagramId)),
    showConvertToRelationalDialog: (diagramId, name) =>
      dispatch(ConvertActions.showConvertToRelationalDialog(diagramId, name)),
    generateSql: content => dispatch(ConvertActions.generateSql(content))
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(DiagramList)
  )
)
