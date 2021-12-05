import React from "react"
import { withStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableContextColumn from "./TableContextColumn"
import TableContextSelectedColumn from "./TableContextSelectedColumn"
import { defaultDataTypes } from "../lib/DataTypes"

const styles = theme => ({
  nameCell: {
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 4
  },
  checkCell: {
    textAlign: "center",
    paddingLeft: 4,
    paddingRight: 4
  }
})

function TableContextViewNormal(props) {
  const {
    classes,
    attributes,
    selectedAttributeId,
    focusAttributeName,
    handleAttributeNameChange,
    handleClickRow,
    handleDataTypeChange,
    handleDataTypeSizeChange,
    dataTypes
  } = props

  const mapDataType = id => {
    let found = defaultDataTypes.find(dt => dt.id === id)
    if (!found) {
      found = defaultDataTypes.find(dt => dt.id === "none")
    }
    return found
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.nameCell}>Name</TableCell>
          <TableCell className={classes.nameCell}>Data Type</TableCell>
          <TableCell className={classes.checkCell}>Data Type Size</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {attributes.map(a => {
          const dt = mapDataType(a.dataType)
          if (selectedAttributeId === a.id) {
            return (
              <TableContextSelectedColumn
                key={a.id}
                names={a.names}
                pkMember={a.pkMember}
                fk={a.fk}
                dataType={dt}
                dataTypeSize={a.dataTypeSize}
                handleAttributeNameChange={handleAttributeNameChange}
                handleDataTypeChange={handleDataTypeChange}
                handleDataTypeSizeChange={handleDataTypeSizeChange}
                dataTypes={dataTypes}
                focusAttributeName={focusAttributeName}
              />
            )
          } else {
            return (
              <TableContextColumn
                key={a.id}
                names={a.names}
                pkMember={a.pkMember}
                fk={a.fk}
                dataType={dt}
                dataTypeSize={a.dataTypeSize}
                handleClickRow={() => handleClickRow(a.id)}
              />
            )
          }
        })}
      </TableBody>
    </Table>
  )
}

export default withStyles(styles)(TableContextViewNormal)
