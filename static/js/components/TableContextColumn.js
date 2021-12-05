import React from "react"
import { withStyles } from "@material-ui/core/styles"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"

const styles = theme => ({
  nameCell: {
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 4
  },
  nameCellPrimaryKey: {
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 4,
    fontWeight: 800,
    textDecoration: "underline"
  },
  nameP: {
    width: 80
  },
  checkCell: {
    textAlign: "center",
    paddingLeft: 4,
    paddingRight: 4
  },
  dataTypeCell: {
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 4
  },
  dataTypeSizeCell: {
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 4
  },
  dataTypeP: {
    width: 90
  },
  dataTypeSizeP: {
    width: 60
  },
  fkNoteP: {
    margin: 0,
    textAlign: "right"
  }
})

function TableContextColumn(props) {
  const { classes, handleClickRow, names, pkMember, optional, soloUnique, dataType, fk, dataTypeSize } = props

  return (
    <TableRow hover onClick={handleClickRow}>
      <TableCell className={pkMember ? classes.nameCellPrimaryKey : classes.nameCell}>
        {names.map((name, index) => (
          <p key={index} className={classes.nameP}>
            {name}
          </p>
        ))}
      </TableCell>

      {!fk && (
        <TableCell className={classes.dataTypeCell}>
          <p className={classes.dataTypeP}>{dataType && dataType.name}</p>
        </TableCell>
      )}

      {!fk && (
        <TableCell className={classes.dataTypeSizeCell}>
          <p className={classes.dataTypeSizeP}>{dataType && dataTypeSize}</p>
        </TableCell>
      )}

      {fk && (
        <TableCell colSpan={2}>
          <p className={classes.fkNoteP}>(Foreign Key)</p>
        </TableCell>
      )}
    </TableRow>
  )
}

export default withStyles(styles)(TableContextColumn)
