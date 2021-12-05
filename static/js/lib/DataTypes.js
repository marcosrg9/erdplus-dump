export const defaultDataTypes = [
  {
    id: "none",
    sql: "",
    name: "None",
    hasSize: false,
    isCustom: false
  },
  {
    id: "charn",
    name: "CHAR(n)",
    sql: "CHAR",
    hasSize: true,
    isCustom: false
  },
  {
    id: "varcharn",
    name: "VARCHAR(n)",
    sql: "VARCHAR",
    hasSize: true,
    isCustom: false
  },
  {
    id: "int",
    name: "INT",
    sql: "INT",
    hasSize: false,
    isCustom: false
  },
  {
    id: "numeric",
    name: "NUMERIC(p s)",
    sql: "NUMERIC",
    hasSize: true,
    isCustom: false
  },
  {
    id: "date",
    name: "DATE",
    sql: "DATE",
    hasSize: false,
    isCustom: false
  },
  {
    id: "float",
    name: "FLOAT",
    sql: "FLOAT",
    hasSize: false,
    isCustom: false
  },
  {
    id: "custom",
    name: "Custom",
    sql: "",
    hasSize: true,
    isCustom: true
  }
]

// export const scanDiagramDataTypes = (diagram) => {
//   // Scan diagram for all custom data types
//   let customTypes = []
//   if (diagram && diagram.shapes) {
//     const tableAttributes = diagram.shapes.filter(s => s.type === "Table").map(t => t.details.attributes)
//     const attributes = tableAttributes.reduce((acc, curr) => [...acc, ...curr], [])
//     customTypes = attributes.filter(a => a.dataType === "custom").map(a => ({
//       id: "custom",
//       sql: "",
//       name: a.dataTypeSize,
//       hasSize: false,
//       isCustom: true
//     }))
//   }
//   return customTypes
// }
