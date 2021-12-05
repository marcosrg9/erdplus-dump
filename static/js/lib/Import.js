// Handles import diagram files by preparing a diagram payload suitable for creating a new diagram.

const DiagramTypes = {
  Erd: "er",
  Relational: "relational",
  Star: "star"
}

const erShapes = ["Entity", "Attribute", "Relationship"]
const relationalShapes = ["Table"]
const starShapes = ["Dimension", "Fact"]

const detectDiagramType = content => {
  if (content && Array.isArray(content.shapes)) {
    const shapes = content.shapes
    if (shapes.findIndex(s => erShapes.includes(s.type)) !== -1) {
      return DiagramTypes.Erd
    } else if (shapes.findIndex(s => relationalShapes.includes(s.type)) !== -1) {
      return DiagramTypes.Relational
    } else if (shapes.findIndex(s => starShapes.includes(s.type)) !== -1) {
      return DiagramTypes.Star
    }
  }

  throw new Error("Unkwnon Diagram Type")
}

const handleImportFile = (file, folderId) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onabort = () => {
      reject({
        name: file.name,
        ok: false
      })
    }

    reader.onerror = () => {
      reject({
        name: file.name,
        ok: false
      })
    }

    reader.onload = event => {
      try {
        const content = JSON.parse(event.target.result)
        const diagramType = detectDiagramType(content)

        resolve({
          name: file.name,
          ok: true,
          diagram: {
            folderId,
            name: file.name,
            diagramType,
            content: JSON.stringify(content)
          }
        })
      } catch (e) {
        reject({
          name: file.name,
          ok: false
        })
      }
    }

    reader.readAsText(file)
  })
}

export default handleImportFile
