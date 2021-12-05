import React from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import DiagramActions from "../redux/Diagram"
import Grid from "@material-ui/core/Grid"
import FolderList from "./FolderList"
import { withRouter } from "react-router-dom"

const styles = theme => ({
  dialog: {},
  folderTree: {
    width: 420,
    height: 280,
    overflowY: "scroll",
    overflowX: "hidden",
    border: "1px solid #efefef"
  }
})

class MoveToFolderDialog extends React.Component {
  state = {
    foldersMeta: [],
    currendFolderId: 0
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.showMoveToFolderDialog === false && this.props.showMoveToFolderDialog === true) {
      const foldersMeta = this.props.folders.map(f => ({
        id: f.id,
        isOpen: f.folderType === "root"
      }))
      this.setState({
        foldersMeta: foldersMeta,
        currendFolderId: 0
      })
    }
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state.currendFolderId)
    this.props.moveToFolderDialogCancel()
  }

  handleCancel = () => {
    this.props.moveToFolderDialogCancel()
  }

  expandFolder = folderId => {
    const foldersMeta = this.state.foldersMeta.map(m => {
      if (m.id === folderId) {
        return {
          ...m,
          isOpen: true
        }
      } else {
        return m
      }
    })
    this.setState({
      foldersMeta
    })
  }

  collapseFolder = folderId => {
    const foldersMeta = this.state.foldersMeta.map(m => {
      if (m.id === folderId) {
        return {
          ...m,
          isOpen: false
        }
      } else {
        return m
      }
    })
    this.setState({
      foldersMeta
    })
  }

  selectFolder = folderId => {
    this.setState({
      currendFolderId: folderId
    })
  }

  makeFolderTree = (folders, foldersMeta, currendFolderId) => {
    if (folders.length === 0) {
      return []
    }

    const merged = folders.map(folder => {
      const meta = foldersMeta.find(f => f.id === folder.id)
      return {
        ...meta,
        ...folder,
        isSelected: folder.id === currendFolderId
      }
    })

    const rootFolder = merged.find(m => m.folderType === "root")
    const trashFolder = merged.find(m => m.folderType === "trash")

    rootFolder.depth = 0
    trashFolder.depth = 0
    trashFolder.children = []

    const addChildren = mergedFolder => {
      const children = merged.filter(m => m.parentId === mergedFolder.id)
      children.forEach(kid => {
        kid.depth = mergedFolder.depth + 1
        addChildren(kid)
      })
      mergedFolder.children = children
    }

    addChildren(rootFolder)

    return [rootFolder, trashFolder]
  }

  render() {
    const { foldersMeta, currendFolderId } = this.state

    const { classes, folders, showMoveToFolderDialog } = this.props

    const folderTree = this.makeFolderTree(folders, foldersMeta, currendFolderId)

    return (
      <Dialog open={showMoveToFolderDialog} aria-labelledby="move-to-folder-dialog" onEscapeKeyDown={this.handleCancel}>
        <DialogContent>
          <DialogContentText>Select a folder</DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={12} className={classes.folderTree}>
              <FolderList
                folderTree={folderTree}
                expandFolder={this.expandFolder}
                collapseFolder={this.collapseFolder}
                selectFolder={this.selectFolder}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel (ESC)
          </Button>
          <Button onClick={this.handleSubmit} color="primary" disabled={currendFolderId === 0}>
            Move
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => {
  return {
    folders: state.folder.folders,
    showMoveToFolderDialog: state.diagram.showMoveToFolderDialog
  }
}

const mapDispatchToProps = dispatch => {
  return {
    moveToFolderDialogCancel: () => dispatch(DiagramActions.moveToFolderDialogCancel())
  }
}
export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withMobileDialog()(MoveToFolderDialog))
  )
)
