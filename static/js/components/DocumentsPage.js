import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import FolderList from "./FolderList"
import DiagramList from "./DiagramList"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import FolderActions from "../redux/Folder"
import DiagramActions from "../redux/Diagram"
import EditActions from "../redux/Edit"
import Header from "./Header"
import NewFolderDialog from "./NewFolderDialog"
import EditFolderDialog from "./EditFolderDialog"
import NewDiagramDialog from "./NewDiagramDialog"
import DeleteFolderDialog from "./DeleteFolderDialog"
import RenameDiagramDialog from "./RenameDiagramDialog"
import ImportDiagramDialog from "./ImportDiagramDialog"
import ConvertToRelationalDialog from "./ConvertToRelationalDialog"
import ConvertToSqlDialog from "./ConvertToSqlDialog"
import { Typography } from "@material-ui/core"
import MoveToFolderDialog from "./MoveToFolderDialog"
import { getFoldersTree } from "../selectors/foldersSelector"
import ReactGA from "react-ga"

const gutter = 5
const foldersWidth = 400
const top = 75
const buttonRowHeight = 40

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grid: {},
  button: {
  },
  buttonIcon: {
    marginRight: 12
  },
  helperText: {
    display: "inline-flex",
    marginLeft: 10
  },
  buttonContainer: {},
  section: {
    height: "100%",
    display: "flex",
    flexFlow: "column",
    backgroundColor: "#eeeeee"
  },
  contentArea: {
    height: "100%"
  },
  folderButtonsArea: {
    position: "fixed",
    top: top,
    left: gutter,
    width: foldersWidth,
    height: buttonRowHeight
    // backgroundColor: "pink"
  },
  folderArea: {
    position: "fixed",
    top: top + buttonRowHeight + gutter,
    left: gutter,
    width: foldersWidth,
    bottom: gutter,
    // backgroundColor: "red",
    backgroundColor: "white",
    overflowY: "auto",
    overflowX: "hidden",
    border: "1px solid #e0e0e0"
  },
  documentButtonsArea: {
    position: "fixed",
    top: top,
    left: 2 * gutter + foldersWidth,
    right: gutter,
    height: buttonRowHeight
    // backgroundColor: "green"
  },
  documentsArea: {
    position: "fixed",
    top: top + buttonRowHeight + gutter,
    left: 2 * gutter + foldersWidth,
    right: gutter,
    bottom: gutter,
    // backgroundColor: "blue",
    backgroundColor: "white",
    overflowY: "audo",
    overflowX: "hidden",
    border: "1px solid #e0e0e0"
  }
})

class DocumentsPage extends Component {
  state = {
    anchorEl: null,
    selectedIds: []
  }

  componentDidMount() {
    ReactGA.pageview("/documents")
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleNewFolderClick = () => {
    this.props.createFolderDialogShow()
  }

  handleRenameFolderClick = () => {
    this.props.editFolderDialogShow(this.props.currentFolderId)
  }

  handleDeleteFolderClick = () => {
    this.props.deleteFolderDialogShow(this.props.currentFolderId)
  }

  handleNewDiagramClick = () => {
    this.props.createDiagramDialogShow()
  }

  handleImportDiagram = () => {
    this.props.importDiagramDialogShow()
  }

  //
  // Move folders
  //

  handleOrganizeDiagram = () => {
    this.props.setDocumentsPageMode("select")
    this.setState({
      selectedIds: []
    })
  }

  handleMoveDone = () => {
    this.props.setDocumentsPageMode("list")
  }

  handleMoveTo = () => {
    this.props.moveToFolderDialogShow()
  }

  handleSelectDiagram = id => {
    let ids = [...this.state.selectedIds]
    const index = ids.indexOf(id)
    if (index === -1) {
      ids.push(id)
    } else {
      ids.splice(index, 1)
    }
    this.setState({
      selectedIds: ids
    })
  }

  handleMoveToFolderSubmit = folderId => {
    const selectedIds = this.state.selectedIds
    const selectecDiagrams = this.props.diagrams
      .filter(d => selectedIds.indexOf(d.id) !== -1)
      .map(d => ({ ...d, folderId: folderId }))
    this.props.saveManyDiagrams(selectecDiagrams)
  }

  selectFolder = folderId => {
    this.handleMoveDone()
    this.props.selectFolder(folderId)
  }

  render() {
    const { classes, folderTree, expandFolder, collapseFolder, documentsPageMode, currentFolderType } = this.props

    const { selectedIds } = this.state

    const canRename = currentFolderType !== "trash" && currentFolderType !== "root"

    const isTrash = currentFolderType === "trash"

    return (
      <section className={classes.section}>
        <Header />
        <div className={classes.contentArea}>
          <NewFolderDialog />
          <EditFolderDialog />
          <NewDiagramDialog />
          <RenameDiagramDialog />
          <DeleteFolderDialog />
          <ImportDiagramDialog importDiagrams={this.props.importDiagrams} standalone={false} />
          <ConvertToRelationalDialog />
          <ConvertToSqlDialog />
          <MoveToFolderDialog onSubmit={this.handleMoveToFolderSubmit} />
          <div className={classes.folderButtonsArea}>
            <Grid container spacing={1} className={classes.grid}>
              <Grid item xs={12}>
                <div className={classes.buttonContainer}>
                  <ButtonGroup>
                    <Button className={classes.button} onClick={this.handleNewFolderClick}>
                      New Folder...
                    </Button>
                    <Button
                      className={classes.button}
                      onClick={this.handleRenameFolderClick}
                      disabled={!canRename}>
                      Rename...
                    </Button>
                    <Button
                      className={classes.button}
                      onClick={this.handleDeleteFolderClick}
                      disabled={!canRename}>
                      Delete...
                    </Button>
                  </ButtonGroup>
                </div>
              </Grid>
            </Grid>
          </div>

          <div className={classes.folderArea}>
            <Grid container spacing={1} className={classes.grid}>
              <Grid item xs={12}>
                <FolderList
                  folderTree={folderTree}
                  expandFolder={expandFolder}
                  collapseFolder={collapseFolder}
                  selectFolder={this.selectFolder}
                />
              </Grid>
            </Grid>
          </div>

          <div className={classes.documentButtonsArea}>
            <Grid container spacing={1} className={classes.grid}>
              <Grid item xs={12}>
                {documentsPageMode === "list" && (
                  <div className={classes.buttonContainer}>
                    <ButtonGroup>
                      <Button className={classes.button} onClick={this.handleNewDiagramClick} disabled={isTrash}>
                        New Diagram...
                      </Button>
                      <Button className={classes.button} onClick={this.handleImportDiagram} disabled={isTrash}>
                        Import...
                      </Button>
                      <Button className={classes.button} onClick={this.handleOrganizeDiagram}>
                        Organize...
                      </Button>
                    </ButtonGroup>
                  </div>
                )}

                {documentsPageMode === "select" && (
                  <div className={classes.buttonContainer}>
                    <ButtonGroup>
                      <Button variant="outlined" className={classes.button} onClick={this.handleMoveDone}>
                        Back
                      </Button>
                      <Button
                        variant="outlined"
                        className={classes.button}
                        onClick={this.handleMoveTo}
                        disabled={selectedIds.length === 0}>
                        Move...
                      </Button>
                    </ButtonGroup>
                    <Typography className={classes.helperText} variant="body1">
                      Select diagrams to move to another folder or to Trash.
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </div>

          <div className={classes.documentsArea}>
            <Grid container spacing={1} className={classes.grid}>
              <Grid item xs={12}>
                <DiagramList
                  mode={documentsPageMode}
                  selectedIds={selectedIds}
                  onSelectDiagram={this.handleSelectDiagram}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </section>
    )
  }
}

const mapStateToProps = state => {
  const currentFolder = state.folder.folders.find(f => f.id === state.folder.currentFolderId)
  const currentFolderType = !!currentFolder ? currentFolder.folderType : ""
  return {
    folderTree: getFoldersTree(state),
    diagrams: state.diagram.diagrams,
    documentsPageMode: state.diagram.documentsPageMode,
    currentFolderId: state.folder.currentFolderId,
    currentFolderType
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createFolderDialogShow: () => dispatch(FolderActions.createFolderDialogShow()),
    editFolderDialogShow: folderId => dispatch(FolderActions.editFolderDialogShow(folderId)),
    deleteFolderDialogShow: folderId => dispatch(FolderActions.deleteFolderDialogShow(folderId)),
    expandFolder: folderId => dispatch(FolderActions.expandFolder(folderId)),
    collapseFolder: folderId => dispatch(FolderActions.collapseFolder(folderId)),
    selectFolder: folderId => dispatch(FolderActions.selectFolder(folderId)),
    createDiagramDialogShow: () => dispatch(DiagramActions.createDiagramDialogShow()),
    importDiagramDialogShow: () => dispatch(DiagramActions.importDiagramDialogShow()),
    setCanvasSize: (width, height) => dispatch(EditActions.setCanvasSize(width, height)),
    moveToFolderDialogShow: () => dispatch(DiagramActions.moveToFolderDialogShow()),
    saveManyDiagrams: diagrams => dispatch(DiagramActions.saveManyDiagrams(diagrams)),
    setDocumentsPageMode: mode => dispatch(DiagramActions.setDocumentsPageMode(mode)),
    importDiagrams: diagrams => dispatch(DiagramActions.importDiagrams(diagrams))
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DocumentsPage)
)
