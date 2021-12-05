import React from "react"
import { withStyles } from "@material-ui/core/styles"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import Checkbox from "@material-ui/core/Checkbox"
import Input from "@material-ui/core/Input"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import { defaultDataTypes } from "../lib/DataTypes"

const styles = theme => ({
  nameCell: {
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 4
  },
  cell: {
    textAlign: "center",
    paddingLeft: 4,
    paddingRight: 4
  },
  input: {
    width: "100%",
    fontSize: "0.8125rem"
  },
  dataTypeCell: {
    textAlign: "left",
    paddingLeft: 4,
    paddingRight: 4
  },
  dataTypeSelect: {
    width: 90,
    fontSize: "0.8125rem"
  }
})

function TableContextSelectedColumn(props) {
  const textField = input => {
    if (input && props.focusAttributeName) {
      setTimeout(() => {
        input.focus()
        input.select()
      }, 0)
    }
  }

  const {
    classes,
    names,
    fk,
    dataType,
    dataTypeSize,
    handleAttributeNameChange,
    handleDataTypeChange,
    handleDataTypeSizeChange
  } = props

  return (
    <TableRow selected hover>
      <TableCell className={classes.nameCell}>
        {names.map((name, index) => {
          if (index === 0) {
            return (
              <Input
                key={index}
                value={name}
                className={classes.input}
                inputProps={{ ref: textField }}
                onChange={event => handleAttributeNameChange(event.target.value, index)}
              />
            )
          } else {
            return (
              <Input
                key={index}
                value={name}
                className={classes.input}
                onChange={event => handleAttributeNameChange(event.target.value, index)}
              />
            )
          }
        })}
      </TableCell>

      {!fk && (
        <TableCell className={classes.dataTypeCell}>
          <FormControl>
            <Select
              value={dataType && dataType.id}
              onChange={handleDataTypeChange}
              displayEmpty
              name="dataType"
              className={classes.dataTypeSelect}>
              {defaultDataTypes.map(dt => (
                <MenuItem key={dt.id} value={dt.id}>
                  {dt.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
      )}

      {!fk && (
        <TableCell className={classes.cell}>
          {dataType && dataType.hasSize && (
            <Input value={dataTypeSize} className={classes.input} onChange={handleDataTypeSizeChange} />
          )}
        </TableCell>
      )}

      {fk && (
        <TableCell colSpan={2}>
          <p className={classes.fkNoteP}>Foreign Key data types cannot be changed.</p>
        </TableCell>
      )}
    </TableRow>
  )
}

export default withStyles(styles)(TableContextSelectedColumn)
