var format = require("util").format

function SqlGenerator(diagram) {
  if (typeof diagram === "string") {
    this.diagram = JSON.parse(diagram)
  } else {
    this.diagram = diagram
  }
}

SqlGenerator.prototype.columnTypes = [
  {
    id: "none",
    name: "No Data Type",
    sql: "NODATATYPE",
    hasSize: false
  },
  {
    id: "custom",
    name: "Custom Data Type",
    sql: "",
    hasSize: true
  },
  {
    id: "charn",
    name: "CHAR(n)",
    sql: "CHAR",
    hasSize: true
  },
  {
    id: "varcharn",
    name: "VARCHAR(n)",
    sql: "VARCHAR",
    hasSize: true
  },
  {
    id: "int",
    name: "INT",
    sql: "INT",
    hasSize: false
  },
  {
    id: "numeric",
    name: "NUMERIC(p s)",
    sql: "NUMERIC",
    hasSize: true
  },
  {
    id: "date",
    name: "DATE",
    sql: "DATE",
    hasSize: false
  },
  {
    id: "float",
    name: "FLOAT",
    sql: "FLOAT",
    hasSize: false
  }
]

SqlGenerator.prototype.generate = function() {
  this.initSqlTables()
  this.processAttributes()
  this.processUnique()
  this.resolveFkColumnDataTypes()
  this.resolveFkReferenceNames()
  this.sortTables()
  this.toSqlLines()
  return this.toSql()
}

SqlGenerator.prototype.initSqlTables = function() {
  this.tables = {}
  for (let shape of this.diagram.shapes) {
    if (shape.type === "Table" || shape.type === "Fact" || shape.type === "Dimension") {
      this.tables[shape.details.id] = {
        name: shape.details.name,
        original: shape,
        columns: {},
        foreignKeys: [],
        requiredTables: []
      }
    }
  }
}

SqlGenerator.prototype.processAttributes = function() {
  for (let tableId in this.tables) {
    let table = this.tables[tableId]
    for (let attr of table.original.details.attributes) {
      if (attr.fk) {
        // Track the fk as a group
        table.foreignKeys.push({
          names: attr.names,
          references: attr.references
        })

        // Add each column of the fk
        let refIndex = 0
        for (let nameIndex in attr.names) {
          let name = attr.names[nameIndex]
          let ref = attr.references[refIndex]
          table.columns[format("%s-%s", attr.id, refIndex)] = {
            name: name,
            pkMember: attr.pkMember,
            optional: attr.optional,
            fk: true,
            reference: {
              tableId: ref.tableId,
              columnId: ref.attributeId,
              fkSubIndex: ref.fkSubIndex
            }
          }
          refIndex += 1
        }
      } else {
        // Add the simple column
        table.columns[attr.id] = {
          name: attr.names[0],
          pkMember: attr.pkMember,
          optional: attr.optional,
          dataType: this.getSqlDataType(attr.dataType, attr.dataTypeSize)
        }
      }
    }
  }
}

SqlGenerator.prototype.processUnique = function() {
  // Add solo-unique and unique groups to table.unique array.
  for (let tableId in this.tables) {
    let table = this.tables[tableId]
    table.unique = []
    for (let attr of table.original.details.attributes) {
      if (attr.soloUnique && !attr.pkMember) {
        table.unique.push([attr.id])
      }
    }
    table.unique = table.unique.concat(table.original.details.uniqueGroups)
  }
}

/**
 * Assign a data type to every foreign key by looking up the original
 * primary key referenced by the FK.
 */
SqlGenerator.prototype.resolveFkColumnDataTypes = function() {
  for (let tableId in this.tables) {
    let table = this.tables[tableId]
    for (let columnId in table.columns) {
      let column = table.columns[columnId]
      if (column.fk) {
        column.dataType = this.resolveDataType(
          column.reference.tableId,
          column.reference.columnId,
          column.reference.fkSubIndex
        )
      }
    }
  }
}

SqlGenerator.prototype.resolveDataType = function(tableId, columnId, fkSubIndex) {
  let found = undefined
  if (typeof fkSubIndex === "number") {
    let columnIndexName = format("%s-%s", columnId, fkSubIndex)
    found = this.tables[tableId].columns[columnIndexName]
  } else {
    found = this.tables[tableId].columns[columnId]
  }

  if (found === undefined) {
    return "(not found)"
  } else if (typeof found.dataType === "string") {
    return found.dataType
  } else if (found.fk) {
    let dt = this.resolveDataType(found.reference.tableId, found.reference.columnId, found.reference.fkSubIndex)
    found.dataType = dt
    return dt
  }
}

/**
 * Assign a name to every foreign key by looking up the referenced column.
 */
SqlGenerator.prototype.resolveFkReferenceNames = function() {
  for (let tableId in this.tables) {
    let table = this.tables[tableId]
    for (let fk of table.foreignKeys) {
      // Set reference name of table
      let refTableId = fk.references[0].tableId
      fk.referencedTableName = this.tables[refTableId].name

      // Set referenced name of each column
      for (let ref of fk.references) {
        let name = this.resolveFkReferenceName(ref.tableId, ref.attributeId, ref.fkSubIndex)
        ref.name = name
      }
    }
  }
}

SqlGenerator.prototype.resolveFkReferenceName = function(tableId, columnId, fkSubIndex) {
  let found = undefined
  if (typeof fkSubIndex === "number") {
    let columnIndexName = format("%s-%s", columnId, fkSubIndex)
    found = this.tables[tableId].columns[columnIndexName]
  } else {
    found = this.tables[tableId].columns[columnId]
  }

  if (found) {
    return found.name
  } else {
    return "missing"
  }
}

SqlGenerator.prototype.resolveAllFkReferenceNames = function(table, columnId) {
  let names = []
  let i = 0
  let columnIndexName = format("%s-%s", columnId, i)
  while (table.columns.hasOwnProperty(columnIndexName)) {
    names.push(table.columns[columnIndexName].name)
    i += 1
    columnIndexName = format("%s-%s", columnId, i)
  }
  return names
}

/**
 * Attempt to sort the tables in an order that allows valid SQL.
 * Tables with FKs should be listed after the tables they reference.
 */
SqlGenerator.prototype.sortTables = function() {
  for (let conn of this.diagram.connectors) {
    if (conn.type === "TableConnector") {
      let pkTableId = conn.source
      let fkTableId = conn.destination
      this.tables[fkTableId].requiredTables.push(pkTableId)
    }
  }

  // do
  //    move any table from this.tables to sortedTables if
  //    sortedTable contains all of that tables required tables.
  // while (number of moved tables > 0)
  let sortedTables = []
  let count = 0
  let movedTables = {}
  do {
    count = 0
    for (let id in this.tables) {
      let containsAll = true
      for (let requiredId of this.tables[id].requiredTables) {
        containsAll = containsAll && movedTables[requiredId]
      }
      if (containsAll) {
        count += 1
        sortedTables.push(this.tables[id])
        delete this.tables[id]
        movedTables[id] = true
      }
    }
  } while (count > 0)

  // move all remaining tables form this.tables to sortedTables.
  //   (if this happesn it probablys means we have a circular dependency
  //    which I currently don't support)
  for (let id in this.tables) {
    sortedTables.push(this.tables[id])
    delete this.tables[id]
  }

  this.tables = sortedTables
}

/**
 * Add a lines array containing SQL code to each table
 */
SqlGenerator.prototype.toSqlLines = function() {
  for (let table of this.tables) {
    table.lines = []
    table.lines.push(this.formatCreateTable(table.name))
    table.lines.push("(")

    var bodyLines = []

    // Add all columns
    for (let columnId in table.columns) {
      var c = table.columns[columnId]
      bodyLines.push(this.formatColumn(c.name, c.dataType, c.optional))
    }

    // Add primary key
    let pkMemberNames = []
    for (let columnId in table.columns) {
      let c = table.columns[columnId]
      if (c.pkMember) {
        pkMemberNames.push(c.name)
      }
    }
    if (pkMemberNames.length > 0) {
      bodyLines.push(this.formatPrimaryKey(pkMemberNames))
    }

    // Add all foreign keys
    for (let fk of table.foreignKeys) {
      let referencedNames = fk.references.map(function(item) {
        return item.name
      })
      bodyLines.push(this.formatForeignKey(fk.names, referencedNames, fk.referencedTableName))
    }

    // Add all the unique lines
    for (let u of table.unique) {
      let names = []
      for (let columnId of u) {
        if (table.columns[columnId] === undefined) {
          // Look for FK names
          let fkNames = this.resolveAllFkReferenceNames(table, columnId)
          names = names.concat(fkNames)
        } else {
          names.push(table.columns[columnId].name)
        }
      }
      bodyLines.push(this.formatUnique(names))
    }

    // Need to add a comma at the end the body lines
    for (let i = 0; i < bodyLines.length - 1; ++i) {
      bodyLines[i] = bodyLines[i] + ","
    }

    table.lines = table.lines.concat(bodyLines)
    table.lines.push(");")
    table.lines.push("")
  }
}

SqlGenerator.prototype.toSql = function() {
  let lines = []
  for (let table of this.tables) {
    lines = lines.concat(table.lines)
  }
  return lines.join("\n")
}

SqlGenerator.prototype.formatCreateTable = function(name) {
  return format("CREATE TABLE %s", this.sanitizeName(name))
}

SqlGenerator.prototype.formatColumn = function(name, type, optional) {
  if (optional) {
    return format("  %s %s", this.sanitizeName(name), type)
  } else {
    return format("  %s %s NOT NULL", this.sanitizeName(name), type)
  }
}

SqlGenerator.prototype.formatUnique = function(names) {
  return format("  UNIQUE (%s)", this.sanitizeName(names).join(", "))
}

SqlGenerator.prototype.formatPrimaryKey = function(names) {
  return format("  PRIMARY KEY (%s)", this.sanitizeName(names).join(", "))
}

SqlGenerator.prototype.formatForeignKey = function(names, referencedNames, referencedTableName) {
  return format(
    "  FOREIGN KEY (%s) REFERENCES %s(%s)",
    this.sanitizeName(names).join(", "),
    this.sanitizeName(referencedTableName),
    this.sanitizeName(referencedNames).join(", ")
  )
}

SqlGenerator.prototype.getSqlDataType = function(dataType, dataTypeSize) {
  if (dataType === "custom") {
    return dataTypeSize
  } else {
    let sz = dataTypeSize
    if (typeof sz === "string" && sz.length > 0) {
      if (sz.charAt(0) !== "(") {
        sz = "(" + sz
      }
      if (sz.charAt(sz.length - 1) !== ")") {
        sz = sz + ")"
      }
    } else {
      sz = ""
    }
    return format("%s%s", this.mapSqlDataType(dataType), sz)
  }
}

SqlGenerator.prototype.mapSqlDataType = function(dataType) {
  for (let i = 0; i < this.columnTypes.length; ++i) {
    let dt = this.columnTypes[i]
    if (dt.id === dataType) {
      return dt.sql
    }
  }
  return dataType
}

SqlGenerator.prototype.sanitizeName = function(nameOrArray) {
  if (Array.isArray(nameOrArray)) {
    let out = []
    for (let name of nameOrArray) {
      out.push(this.sanitizeName(name))
    }
    return out
  } else {
    return nameOrArray.replace(new RegExp(" ", "g"), "_")
  }
}

export default SqlGenerator
