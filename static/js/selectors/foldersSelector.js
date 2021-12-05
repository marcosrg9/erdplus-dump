import { createSelector } from "reselect"

const getFolders = state => state.folder.folders
const getFoldersMeta = state => state.folder.foldersMeta
const getCurrentFolderId = state => state.folder.currentFolderId

/**
 * Returns a folder tree for use on the DocumentsPage.
 */
export const getFoldersTree = createSelector(
  [getFolders, getFoldersMeta, getCurrentFolderId],
  (folders, foldersMeta, currendFolderId) => {
    if (folders.length === 0) {
      return []
    }

    const merged = folders.map(folder => {
      const meta = foldersMeta.find(f => f.id === folder.id)
      return {
        ...meta,
        ...folder,
        isSelected: folder.id === currendFolderId
      }
    })

    const rootFolder = merged.find(m => m.folderType === "root")
    const trashFolder = merged.find(m => m.folderType === "trash")

    rootFolder.depth = 0
    trashFolder.depth = 0
    trashFolder.children = []

    const addChildren = mergedFolder => {
      const children = merged.filter(m => m.parentId === mergedFolder.id)
      children.forEach(kid => {
        kid.depth = mergedFolder.depth + 1
        addChildren(kid)
      })
      mergedFolder.children = children
    }

    addChildren(rootFolder)

    return [rootFolder, trashFolder]
  }
)

/**
 * This creates and returns a new folder tree suitable for use by the MoveToFolderDialog.
 */
export const getFoldersForMoveDialog = createSelector(
  [getFolders],
  folders => {
    if (folders.length === 0) {
      return []
    }

    const merged = folders.map(folder => {
      return {
        ...folder,
        isOpen: false,
        isSelected: false
      }
    })

    const rootFolder = merged.find(m => m.folderType === "root")
    rootFolder.isOpen = true

    rootFolder.depth = 0

    const addChildren = mergedFolder => {
      const children = merged.filter(m => m.parentId === mergedFolder.id)
      children.forEach(kid => {
        kid.depth = mergedFolder.depth + 1
        addChildren(kid)
      })
      mergedFolder.children = children
    }

    addChildren(rootFolder)

    return [rootFolder]
  }
)

export const getTrashFolderId = createSelector(
  [getFolders],
  folders => {
    if (folders.length > 0) {
      const trashFolder = folders.find(f => f.folderType === "trash")
      if (trashFolder) {
        return trashFolder.id
      }
    }
    return null
  }
)
