import { createSelector } from "reselect"

const getDiagrams = state => state.diagram.diagrams
const getCurrentFolderId = state => state.folder.currentFolderId
const getRoutePathname = (state, props) => {
  return props.history.location.pathname
}

export const getCurrentFolderDiagrams = createSelector(
  [getDiagrams, getCurrentFolderId],
  (diagrams, currentFolderId) => {
    return diagrams.filter(d => d.folderId === currentFolderId)
  }
)

export const getEditDiagram = createSelector(
  [getDiagrams, getRoutePathname],
  (diagrams, pathname) => {
    const parts = pathname.split("/")
    if (parts.length === 3 && parts[1] === "edit-diagram") {
      const diagramId = parts[2]
      return diagrams.find(d => d.id === diagramId)
    } else {
      return null
    }
  }
)
