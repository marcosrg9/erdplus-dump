const erd = window.erd

// promise 1
// - create and load stage based on tempCanvas
// - draw stage
// - draw image
//

const Margin = 25

const createImage = (diagramContent, transparentBackground, scaleFactor) => {
  console.log("createImage ")

  const options = {
    activeItemChangedCallback: () => {},
    startMoveCallback: () => {},
    endMoveCallback: () => {},
    connectModeEndCallback: () => {},
    dirtyCallback: () => {},
    mouseModeResetCallback: () => {}
  }

  return new Promise((resolve, reject) => {
    const tempCanvas = document.createElement("canvas")
    const imageCanvas = document.createElement("canvas")

    const tempStage = new erd.DiagramStage(tempCanvas, options)
    const archive = new erd.DiagramArchive(tempStage)
    archive.fromJson(diagramContent)

    const bounds = tempStage.getBounds(false)
    let left = bounds.left * scaleFactor
    let right = bounds.right * scaleFactor
    let top = bounds.top * scaleFactor
    let bottom = bounds.bottom * scaleFactor
    let width = right - left
    let height = bottom - top

    // We need to make some slight adjustments to avoid clipping the left or top of shapes.
    if (left > 0) {
      left = left - 2
      width = width + 2
    }
    if (top > 0) {
      top = top - 2
      height = height + 2
    }

    console.log("bounds ", left, top, right, bottom)

    tempCanvas.width = right
    tempCanvas.height = bottom
    imageCanvas.width = width + 2 * Margin
    imageCanvas.height = height + 2 * Margin
    tempStage.setScale(scaleFactor, scaleFactor)
    tempStage.draw()

    //
    const context = imageCanvas.getContext("2d")
    context.clearRect(0, 0, imageCanvas.width, imageCanvas.height)
    if (!transparentBackground) {
      context.beginPath()
      context.fillStyle = "#fff"
      context.rect(0, 0, imageCanvas.width, imageCanvas.height)
      context.fill()
    }

    context.drawImage(tempCanvas, left, top, width, height, Margin, Margin, width, height)

    const dataUrl = imageCanvas.toDataURL("image/png")
    imageCanvas.toBlob(blob => {
      resolve({
        dataUrl,
        blob
      })
    })
  })
}

export default createImage
