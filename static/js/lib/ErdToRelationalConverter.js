let format = require("util").format

function ErdToRelationalConverter(diagram) {
  if (typeof diagram === "string") {
    this.er = JSON.parse(diagram)
  } else {
    this.er = diagram
  }
}

// Returns the converted relational schema as an object.
ErdToRelationalConverter.prototype.convert = function() {
  this.init()

  this.convertRegularEntities()
  this.convertSupertypeRelationships()
  this.convertRegularRelationships()
  this.convertUnaryRelationships()
  this.convertPendingMultivaluedAttributes()
  this.convertPendingAssociativeEntities()
  this.positionTables()

  return this.rs
}

ErdToRelationalConverter.prototype.init = function() {
  this.pendingMultivaluedAttributes = []
  this.pendingAssociativeEntities = [] // Contains tables created from associative entities
  this.idMap = {}
  this.nextId = 1
  this.relationshipHistory = [] // Used to detect multiple relationshpis between same tables.
  this.rs = {
    version: 2,
    www: "erdplus.com",
    shapes: [],
    connectors: [],
    width: this.er.width,
    height: this.er.height
  }
}

// Convert all regular entities into tables.
ErdToRelationalConverter.prototype.convertRegularEntities = function() {
  let entities = this.er.shapes.filter(s => {
    return s.type === "Entity"
  })
  for (let entity of entities) {
    let table = this.newTable(entity.details.id)
    table.details.name = entity.details.name

    this.convertEntityAttributes(table, entity)

    this.rs.shapes.push(table)

    if (entity.details.type === "associative") {
      this.pendingAssociativeEntities.push(table)
    }
  }
}

ErdToRelationalConverter.prototype.convertPendingAssociativeEntities = function() {
  for (let table of this.pendingAssociativeEntities) {
    for (let column of table.details.attributes) {
      if (column.fk) {
        column.pkMember = true
      }
    }
  }
}

// Convert attributes of the entity
ErdToRelationalConverter.prototype.convertEntityAttributes = function(table, entity) {
  let attributes = this.getAttributesByOwnerId(entity.details.id)

  // Determine which attribute (single or composite) should become the PK column(s).
  // If this entity is a subtype then the PK will come from the supertype instead so we 
  // don't need to check any of this entity's attributes.
  let pkAttributeId = undefined
  if (!entity.details.isSubtype) {
    for (let attr of attributes) {
      if (
        pkAttributeId === undefined &&
        attr.details.isUnique &&
        typeof attr.details.name === "string" &&
        attr.details.name.substr(-2).toLowerCase() === "id" &&
        !attr.details.isDerived &&
        !attr.details.isComposite &&
        !attr.details.isMultivalued
      ) {
        // Found a single PK column that ends with "ID"
        pkAttributeId = attr.details.id
      }
    }
    for (let attr of attributes) {
      if (
        pkAttributeId === undefined &&
        attr.details.isUnique &&
        !attr.details.isDerived &&
        !attr.details.isComposite &&
        !attr.details.isMultivalued
      ) {
        // Found a single PK column
        pkAttributeId = attr.details.id
      }
    }
    for (let attr of attributes) {
      if (
        pkAttributeId === undefined &&
        attr.details.isUnique &&
        !attr.details.isDerived &&
        attr.details.isComposite &&
        !attr.details.isMultivalued
      ) {
        // Found a composite PK
        pkAttributeId = attr.details.id
      }
    }
  }

  for (let attr of attributes) {
    if (attr.details.isDerived) {
      // Derieved attributes are skipped.
    } else if (attr.details.isComposite) {
      // Component attributes get added as regular columns.
      // If the composite attribute is unique then the columns become
      // either the PK or a unique group.
      let columns = this.convertComponentAttributes(this.getAttributesByOwnerId(attr.details.id))
      if (attr.details.isUnique) {
        if (attr.details.id === pkAttributeId) {
          columns.forEach(c => {
            c.pkMember = true
          })
        } else {
          let ids = columns.map(c => c.id)
          table.details.uniqueGroups.push(ids)
        }
      }
      table.details.attributes = table.details.attributes.concat(columns)
    } else if (attr.details.isMultivalued) {
      // Convert multivaluted attributes into a new table later on.
      this.pendingMultivaluedAttributes.push({
        table: table,
        entity: entity,
        attribute: attr
      })
    } else {
      // Convert this regular attribute to a column and make the
      // first unique attribute we see the PK column.
      let column = this.newColumn(attr.details.id)
      column.names.push(attr.details.name)
      column.optional = attr.details.isOptional
      if (attr.details.isUnique) {
        if (attr.details.id === pkAttributeId) {
          column.pkMember = true
        } else {
          column.soloUnique = true
        }
      }
      table.details.attributes.push(column)
    }
  }
}

// Comvert component attributes into regular columns.
ErdToRelationalConverter.prototype.convertComponentAttributes = function(attributes) {
  let columns = []
  for (let attr of attributes) {
    let column = this.newColumn(attr.details.id)
    column.names.push(attr.details.name)
    columns.push(column)
  }
  return columns
}

// Convert each multivalued attribute into a new table related to the exiting table.
ErdToRelationalConverter.prototype.convertPendingMultivaluedAttributes = function() {
  for (let p of this.pendingMultivaluedAttributes) {
    let column = this.newColumn()
    column.pkMember = true
    column.names.push(p.attribute.details.name)

    let newTable = this.newTable()
    newTable.details.name = format("%s_%s", p.table.details.name, p.attribute.details.name)
    newTable.details.attributes.push(column)
    this.rs.shapes.push(newTable)

    let fk = this.connectTables(p.table, newTable)
    fk.pkMember = true
  }
}

// Convert regular relationships (not unary)
ErdToRelationalConverter.prototype.convertRegularRelationships = function() {
  let relationships = this.er.shapes.filter(s => {
    return s.type === "Relationship" && s.details.slots[0].entityId !== s.details.slots[1].entityId
  })

  // Convert identifying relationships first
  for (let r of relationships) {
    if (r.details.isIdentifying) {
      this.convertOneRelationship(r)
    }
  }

  for (let r of relationships) {
    if (!r.details.isIdentifying) {
      this.convertOneRelationship(r)
    }
  }
}

// Convert entity supertype-subtype relationships
ErdToRelationalConverter.prototype.convertSupertypeRelationships = function() {

  const supertypeConnectors = this.er.connectors.filter(c => {
    return c.type === "Connector" && c.details.isSupertypeConnector
  })

  for (let connector of supertypeConnectors) {
    const fk = this.connectTables(connector.destination, connector.source)
    fk.pkMember = true
  }
}

ErdToRelationalConverter.prototype.convertOneRelationship = function(r) {
  let slots = r.details.slots
  if (slots[0].cardinality === "one" && slots[1].cardinality === "one") {
    let fk
    if (slots[0].participation === "optional" && slots[1].participation === "optional") {
      fk = this.connectTables(slots[0].entityId, slots[1].entityId, r)
      fk.optional = true
    } else if (slots[1].participation === "mandatory") {
      fk = this.connectTables(slots[0].entityId, slots[1].entityId, r)
    } else {
      fk = this.connectTables(slots[1].entityId, slots[0].entityId, r)
    }
    fk.pkMember = r.details.isIdentifying
  } else if (slots[0].cardinality === "one" && slots[1].cardinality === "many") {
    // Remember that constraints are stored "backwards" to support Chen notation.
    let fk = this.connectTables(slots[1].entityId, slots[0].entityId, r)
    fk.optional = slots[0].participation === "optional"
    fk.pkMember = r.details.isIdentifying
  } else if (slots[0].cardinality === "many" && slots[1].cardinality === "one") {
    // Remember that constraints are stored "backwards" to support Chen notation.
    let fk = this.connectTables(slots[0].entityId, slots[1].entityId, r)
    fk.optional = slots[1].participation === "optional"
    fk.pkMember = r.details.isIdentifying
  } else if (slots[0].cardinality === "many" && slots[1].cardinality === "many") {
    let midTable = this.newTable(r.details.id)
    this.rs.shapes.push(midTable)
    midTable.details.name = r.details.name
    let fk1 = this.connectTables(slots[0].entityId, midTable, r)
    let fk2 = this.connectTables(slots[1].entityId, midTable, r)
    let foundPk = false

    // Add any attributes of the relationship to the newly created midTable
    let attributes = this.getAttributesByOwnerId(r.details.id)
    for (let attr of attributes) {
      let column = this.newColumn(attr.details.id)
      column.names.push(attr.details.name)
      if (!foundPk && attr.details.isUnique) {
        column.pkMember = true
        foundPk = true
      }
      midTable.details.attributes.push(column)
    }

    if (foundPk) {
      // Make fk1 and fk2 a unique group
      midTable.details.uniqueGroups.push([fk1.id, fk2.id])
    } else {
      // Make fk1 and fk2 a composite primary key
      fk1.pkMember = true
      fk2.pkMember = true
    }
  }
}

ErdToRelationalConverter.prototype.convertUnaryRelationships = function() {
  let relationships = this.er.shapes.filter(s => {
    return (
      s.type === "Relationship" &&
      !s.details.isIdentifying &&
      s.details.slots[0].entityId === s.details.slots[1].entityId
    )
  })

  for (let r of relationships) {
    let slots = r.details.slots

    // 1:1 or 1:M
    if (slots[0].cardinality === "one" || slots[1].cardinality === "one") {
      let fk = this.connectTables(slots[0].entityId, slots[1].entityId, r)
      fk.names[0] = format("%s_%s", r.details.name, fk.names[0])
      fk.optional = slots[0].participation === "optional" || slots[1].participation === "optional"
    } else if (slots[0].cardinality === "many" && slots[1].cardinality === "many") {
      let unaryTable = this.newTable(r.details.id)
      unaryTable.details.name = r.details.name
      this.rs.shapes.push(unaryTable)

      let fk1 = this.connectTables(slots[0].entityId, r.details.id, r)
      fk1.names[0] = format("%s_1", fk1.names[0])
      fk1.pkMember = true
      let fk2 = this.connectTables(slots[0].entityId, r.details.id, r)
      fk2.names[0] = format("%s_2", fk2.names[0])
      fk2.pkMember = true
    }
  }
}

/// Utility functions

ErdToRelationalConverter.prototype.newTable = function(id) {
  return {
    type: "Table",
    details: {
      name: "",
      x: 0,
      y: 0,
      sort: "automatic",
      attributes: [],
      uniqueGroups: [],
      id: this.mapId(id)
    }
  }
}

ErdToRelationalConverter.prototype.newColumn = function(id) {
  return {
    names: [],
    order: 0,
    pkMember: false,
    optional: false,
    soloUnique: false,
    fk: false,
    dataType: "int",
    dataTypeSize: null,
    id: this.mapId(id)
  }
}

ErdToRelationalConverter.prototype.newConnector = function() {
  return {
    type: "TableConnector",
    details: {
      fkAttributeId: null,
      id: this.mapId()
    },
    source: null,
    destination: null
  }
}

// Create a foreign key column for the given primary key table.
// This is based on a similar function in base_table.js in the web app.
ErdToRelationalConverter.prototype.createFk = function(pkTable) {
  let fk = this.newColumn()
  fk.references = []

  /*
    references is an array of objects like below.

      {
        "tableId": <id>,
        "attributeId": <id>,
        "fkSubIndex": <index>
      }

    This reference refers to the related primary key table.
    fkSubIndex is defined if the referenced primary key attribute
    is itself a FK to some other table.
  */

  fk.fk = true
  for (let i = 0; i < pkTable.details.attributes.length; ++i) {
    let attr = pkTable.details.attributes[i]
    if (attr.pkMember) {
      if (attr.fk) {
        for (let j = 0; j < attr.names.length; ++j) {
          fk.names.push(attr.names[j])
          fk.references.push({
            tableId: pkTable.details.id,
            attributeId: attr.id,
            fkSubIndex: j
          })
        }
      } else {
        fk.names.push(attr.names[0])
        fk.references.push({
          tableId: pkTable.details.id,
          attributeId: attr.id
        })
      }
    }
  }
  return fk
}

// Create a foreign key and connector between the two tables.
// Each table can be specified using the ID of the original shape (usually Entity)
// or it can be specified as an the table itself.
ErdToRelationalConverter.prototype.connectTables = function(pkTable, fkTable, relationship) {
  if (typeof pkTable === "number") {
    pkTable = this.findTableyByMappedId(pkTable)
  }
  if (typeof fkTable === "number") {
    fkTable = this.findTableyByMappedId(fkTable)
  }

  let relationshipsCount = this.recordRelationshipHistory(pkTable.details.id, fkTable.details.id)

  let fk = this.createFk(pkTable)
  fkTable.details.attributes.push(fk)

  if (relationshipsCount > 1) {
    let names = []
    for (let n of fk.names) {
      names.push(relationship.details.name + n)
    }
    fk.names = names
  }

  let conn = this.newConnector()
  conn.details.fkAttributeId = fk.id
  conn.source = pkTable.details.id
  conn.destination = fkTable.details.id
  this.rs.connectors.push(conn)
  return fk
}

// Record the new relationship and return how many total relationships (including the new one)
// existing between this pair of tables.
ErdToRelationalConverter.prototype.recordRelationshipHistory = function(pkTableId, fkTableId) {
  let found = this.relationshipHistory.find(h => {
    return h.pkTableId === pkTableId && h.fkTableId === fkTableId
  })

  if (found) {
    found.count = found.count + 1
    return found.count
  } else {
    this.relationshipHistory.push({
      pkTableId: pkTableId,
      fkTableId: fkTableId,
      count: 1
    })
    return 1
  }
}

ErdToRelationalConverter.prototype.mapId = function(id) {
  if (this.idMap.hasOwnProperty(id)) {
    return this.idMap[id]
  } else {
    let newId = this.nextId
    this.nextId += 1
    if (typeof id === "number") {
      this.idMap[id] = newId
    }
    return newId
  }
}

ErdToRelationalConverter.prototype.positionTables = function() {
  let tables = this.rs.shapes.filter(s => {
    return s.type === "Table"
  })

  // Arrange tables in a square pattern
  let perRow = Math.ceil(Math.sqrt(tables.length))
  let y = 10
  let index = 0
  while (index < tables.length) {
    let row = tables.slice(index, index + perRow)
    index += perRow

    let maxColumnCount = 0
    for (let i = 0; i < row.length; ++i) {
      let table = row[i]
      maxColumnCount = Math.max(maxColumnCount, table.details.attributes.length)
      table.details.x = 10 + i * 165 // Based on WIDTH in base_table.js in the web app plus a 15px margine
      table.details.y = y
    }
    y = y + (maxColumnCount + 1) * 15 // Based on LINE_HEIGHT in base_table.js in the web app
  }

  // TODO: Update diagram dimensions
}

ErdToRelationalConverter.prototype.getAttributesByOwnerId = function(ownerId) {
  let attributes = this.er.shapes.filter(s => {
    return (
      s.type === "Attribute" &&
      this.er.connectors.some(c => {
        return c.source === s.details.id && c.destination === ownerId
      })
    )
  }, this)
  return attributes
}

ErdToRelationalConverter.prototype.findTableyByMappedId = function(entityId) {
  let tableId = this.mapId(entityId)
  return this.rs.shapes.find(s => {
    return s.type === "Table" && s.details.id === tableId
  })
}

// Use module.exports when running the crude unit tests.
//module.exports = ErdToRelationalConverter
export default ErdToRelationalConverter
