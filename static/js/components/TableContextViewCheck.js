import React from "react"
import { withStyles } from "@material-ui/core/styles"
import Checkbox from "@material-ui/core/Checkbox"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"

const styles = theme => ({
  cell: {
    textAlign: "center",
    paddingLeft: 0,
    paddingRight: 0
  }
})

function TableContextViewCheck(props) {
  const { classes, attributes, checkedAttributeIds, handleAttributeChecked, disabledAttributes } = props
  let disabledAttributeIds = []
  if (disabledAttributes) {
    disabledAttributeIds = disabledAttributes.map(a => a.id)
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.cell}>Key</TableCell>
          <TableCell className={classes.cell}>Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {attributes.map(a => (
          <TableRow key={a.id}>
            <TableCell className={classes.cell}>
              <Checkbox
                disabled={disabledAttributeIds.includes(a.id)}
                checked={checkedAttributeIds.includes(a.id)}
                onChange={() => handleAttributeChecked(a.id)}
              />
            </TableCell>
            <TableCell>
              {a.names.map((name, index) => (
                <p key={index}>{name}</p>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default withStyles(styles)(TableContextViewCheck)
