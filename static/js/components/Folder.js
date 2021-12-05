import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { styled } from "../lib/StyleHelpers"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import FolderIcon from "@material-ui/icons/Folder"
import FolderOpenIcon from "@material-ui/icons/FolderOpen"
import Collapse from "@material-ui/core/Collapse"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import IconButton from "@material-ui/core/IconButton"

const styles = theme => ({
  iconButton: {
    margin: theme.spacing(1)
  },
  listItemDefault: {
    height: 48,
    paddingTop: 0,
    paddingBottom: 0
  },
  selected: {
    backgroundColor: theme.palette.action.selected
  }
})

class Folder extends Component {
  toggle = event => {
    event.stopPropagation()
    const { folder, expandFolder, collapseFolder } = this.props
    if (folder.isOpen) {
      collapseFolder(folder.id)
    } else {
      expandFolder(folder.id)
    }
  }

  select = () => {
    this.props.selectFolder(this.props.folder.id)
  }

  render() {
    const { classes, folder, expandFolder, collapseFolder, selectFolder } = this.props

    const hasChildren = folder.children.length > 0

    const NestedListItem = styled(ListItem)(theme => ({
      height: 48,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: theme.spacing(2) * folder.depth
    }))

    let toggleButton
    if (hasChildren) {
      if (folder.isOpen) {
        toggleButton = (
          <IconButton className={classes.iconButton} aria-label="Collapse" onClick={this.toggle}>
            <ExpandLess />
          </IconButton>
        )
      } else {
        toggleButton = (
          <IconButton className={classes.iconButton} aria-label="Expand" onClick={this.toggle}>
            <ExpandMore />
          </IconButton>
        )
      }
    }

    let bgClass
    if (folder.isSelected) {
      bgClass = classes.selected
    }

    const name = folder.folderType === "root" ? "Diagrams" : folder.name

    return (
      <div>
        <div className={bgClass}>
          <NestedListItem button onClick={this.select}>
            <ListItemIcon>{folder.isOpen ? <FolderOpenIcon /> : <FolderIcon />}</ListItemIcon>
            <ListItemText inset primary={name} />
            {toggleButton}
          </NestedListItem>
        </div>
        <Collapse in={folder.isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {folder.children
              .sort((left, right) => {
                return left.name.localeCompare(right.name)
              })
              .map(f => (
                <FolderWith
                  key={f.id}
                  folder={f}
                  expandFolder={expandFolder}
                  collapseFolder={collapseFolder}
                  selectFolder={selectFolder}
                />
              ))}
          </List>
        </Collapse>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

const FolderWith = withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Folder)
)

export default FolderWith
