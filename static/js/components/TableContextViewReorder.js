import React from "react"
import { withStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import ArrowUpBold from "mdi-material-ui/ArrowUpBold"
import ArrowDownBold from "mdi-material-ui/ArrowDownBold"
import IconButton from "@material-ui/core/IconButton"

const styles = theme => ({
  nameCell: {
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 4
  },
  cell: {
    textAlign: "center",
    paddingLeft: 0,
    paddingRight: 0
  }
})

function TableContextViewReorder(props) {
  const { classes, attributes, handleAttributeMoveUp, handleAttributeMoveDown } = props

  // Build array of stubs to simplify reordering
  const stubs = []
  for (let i = 0; i < attributes.length; ++i) {
    stubs.push({
      ...attributes[i],
      prevId: i > 0 ? attributes[i - 1].id : null,
      nextId: i < attributes.length - 1 ? attributes[i + 1].id : null
    })
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.nameCell}>Name</TableCell>
          <TableCell className={classes.cell} />
        </TableRow>
      </TableHead>
      <TableBody>
        {stubs.map(a => (
          <TableRow key={a.id}>
            <TableCell className={classes.nameCell}>
              {a.names.map((name, index) => (
                <p key={index}>{name}</p>
              ))}
            </TableCell>
            <TableCell className={classes.cell}>
              <IconButton
                aria-label="Move Up"
                onClick={() => handleAttributeMoveUp(a.id, a.prevId)}
                disabled={!a.prevId}>
                <ArrowUpBold />
              </IconButton>
              <IconButton
                aria-label="Move Down"
                onClick={() => handleAttributeMoveDown(a.id, a.nextId)}
                disabled={!a.nextId}>
                <ArrowDownBold />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default withStyles(styles)(TableContextViewReorder)
