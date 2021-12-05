import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import Folder from "./Folder"

const styles = theme => ({
  root: {
    height: "100%",
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing(1)
  }
})

class FolderList extends Component {
  render() {
    const { classes, folderTree, expandFolder, collapseFolder, selectFolder } = this.props

    return (
      <List className={classes.root} component="nav">
        {folderTree.map(f => (
          <Folder
            key={f.id}
            folder={f}
            expandFolder={expandFolder}
            collapseFolder={collapseFolder}
            selectFolder={selectFolder}
          />
        ))}
      </List>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FolderList)
)
