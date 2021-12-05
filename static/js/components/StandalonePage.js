import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Header from "./Header"
import StandaloneButtonBar from "./StandaloneButtonBar"
import EditActions from "../redux/Edit"
import DiagramActions from "../redux/Diagram"
import CanvasSizeDialog from "./CanvasSizeDialog"
import ExportImageDialog from "./ExportImageDialog"
import { withRouter } from "react-router-dom"
import EntityContext from "./EntityContext"
import AttributeContext from "./AttributeContext"
import RelationshipContext from "./RelationshipContext"
import LabelContext from "./LabelContext"
import TableContext from "./TableContext"
import ImportDiagramDialog from "./ImportDiagramDialog"
import ReactGA from "react-ga"

const erd = window.erd
const saveAs = window.saveAs
const contextWidth = 320

const styles = (theme) => ({
  section: {
    height: "100%",
    display: "flex",
    flexFlow: "column",
  },
  workArea: {
    display: "flex",
    overflow: "hidden",
  },
  contextArea: {
    width: contextWidth,
    height: "100%",
    overflow: "auto",
    background: "#eeeeee",
    padding: 5,
  },
  canvasParent: {
    flex: 1,
    overflow: "scroll",
    height: "100%",
  },
  canvas: {
    border: "1px solid #aaa",
    margin: 0,
    backgroundColor: theme.palette.background.paper,
  },
  canvasConnectMode: {
    cursor: "crosshair",
  },
})

class StandalonePage extends Component {
  state = {
    diagramType: "er",
    contextType: "",
    contextDetails: null,
    mouseMode: "none",
    editDiagram: null,
    canUndo: false,
    canRedo: false,
    canDelete: false,
    exportImageTransparent: false,
    exportImageScale: null,
  }

  constructor() {
    super()
    this.isReady = false
    this.canvasElement = React.createRef()
  }

  componentDidMount() {
    ReactGA.pageview("/standalone")

    const options = {
      activeItemChangedCallback: this.activeItemChangedCallback,
      startMoveCallback: this.startMoveCallback,
      endMoveCallback: this.endMoveCallback,
      connectModeEndCallback: this.connectModeEndCallback,
      dirtyCallback: this.dirtyCallback,
      mouseModeResetCallback: this.mouseModeResetCallback,
      selectedCountChange: this.selectedCountChange,
    }

    this.stage = new erd.DiagramStage(this.canvasElement.current, options)
    // this.tryLoadDiagram()
  }

  activeItemChangedCallback = (item) => {
    if (this.stage.undoManager.hasCurrentAction()) {
      this.stage.undoManager.endAction()
    }

    if (item) {
      this.setState({
        contextType: item.getType(),
        contextDetails: item.details,
      })
    } else {
      this.setState({
        contextType: "",
        contextDetails: null,
      })
    }
  }

  clearContext = () => {
    this.setState({
      contextType: "",
      contextDetails: null,
    })
  }

  startMoveCallback = () => {
    if (this.stage.undoManager.hasCurrentAction()) {
      this.stage.undoManager.endAction()
    }

    this.stage.undoManager.startAction()
  }

  endMoveCallback = () => {
    this.stage.undoManager.endAction()
    this.dirtyCallback()
  }

  connectModeEndCallback = () => {
    // $scope.$apply();
  }

  dirtyCallback = () => {
    this.setState({
      canUndo: this.stage.undoManager.canUndo(),
      canRedo: this.stage.undoManager.canRedo(),
    })
  }

  mouseModeResetCallback = (mouseMode) => {
    this.setState({
      mouseMode: mouseMode,
    })
  }

  selectedCountChange = () => {
    this.setState({
      canDelete: this.stage.selectedCount() > 0,
    })
  }

  newERDiagram = () => {
    this.newDiagram("er")
  }

  newRelationalSchema = () => {
    this.newDiagram("relational")
  }

  newStarSchema = () => {
    this.newDiagram("star")
  }

  newDiagram = (diagramType) => {
    const defaultContent = JSON.stringify({
      version: 2,
      www: "erdplus.com",
      shapes: [],
      connectors: [],
      width: 2000,
      height: 1000,
    })

    const archive = new erd.DiagramArchive(this.stage)
    const data = archive.fromJson(defaultContent)
    this.setState({
      diagramType: diagramType,
    })
    this.props.setCanvasSize(data.width, data.height)
  }

  getStage = () => {
    return this.stage
  }

  setMouseMode = (mouseMode) => {
    this.setState({
      mouseMode: mouseMode,
    })
  }

  saveDiagram = (diagram) => {
    const blob = new Blob([diagram.content], { type: "text/plain;charset=utf-8" })
    saveAs(blob, `${diagram.name}.erdplus`)
  }

  /**
   * `diagrams` is an array but will contain only 1 diagram. This reuses the ImportDiagramDialog
   */
  importDiagrams = (diagrams) => {
    if (diagrams.length === 1) {
      const diagram = diagrams[0]

      const archive = new erd.DiagramArchive(this.stage)
      const data = archive.fromJson(diagram.content)
      this.setState({
        diagramType: diagram.diagramType,
      })
      this.props.setCanvasSize(data.width, data.height)
      this.props.importDiagramDialogCancel()
      setTimeout(() => this.stage.draw(), 0)
    }
  }

  showCanvasSizeDialog = (minCanvasWidth, minCanvasHeight) => {
    this.props.showCanvasSizeDialog(minCanvasWidth, minCanvasHeight)
  }

  render() {
    const {
      diagramType,
      contextType,
      contextDetails,
      mouseMode,
      editDiagram,
      canUndo,
      canRedo,
      canDelete,
      exportImageTransparent,
      exportImageScale,
    } = this.state

    const { classes, canvasWidth, canvasHeight } = this.props

    let canvasClasses = [classes.canvas]
    if (mouseMode === "connect") {
      canvasClasses.push(classes.canvasConnectMode)
    }

    return (
      <section className={classes.section}>
        <Header />
        <CanvasSizeDialog />
        <ExportImageDialog getStage={this.getStage} />
        <ImportDiagramDialog importDiagrams={this.importDiagrams} standalone={true} />
        <StandaloneButtonBar
          diagramType={diagramType}
          getStage={this.getStage}
          setMouseMode={this.setMouseMode}
          saveDiagram={this.saveDiagram}
          showCanvasSizeDialog={this.showCanvasSizeDialog}
          mouseMode={mouseMode}
          editDiagram={editDiagram}
          canUndo={canUndo}
          canRedo={canRedo}
          canDelete={canDelete}
          exportImageTransparent={exportImageTransparent}
          exportImageScale={exportImageScale}
          newERDiagram={this.newERDiagram}
          newRelationalSchema={this.newRelationalSchema}
          newStarSchema={this.newStarSchema}
          clearContext={this.clearContext}
        />
        <div className={classes.workArea}>
          <div className={classes.canvasParent}>
            <canvas
              className={canvasClasses.join(" ")}
              width={canvasWidth}
              height={canvasHeight}
              ref={this.canvasElement}
            />
          </div>
          <div className={classes.contextArea}>
            {contextType === "Entity" && (
              <EntityContext key={contextDetails.id} contextDetails={contextDetails} getStage={this.getStage} />
            )}
            {contextType === "Attribute" && (
              <AttributeContext key={contextDetails.id} contextDetails={contextDetails} getStage={this.getStage} />
            )}
            {contextType === "Relationship" && (
              <RelationshipContext key={contextDetails.id} contextDetails={contextDetails} getStage={this.getStage} />
            )}
            {contextType === "Label" && (
              <LabelContext key={contextDetails.id} contextDetails={contextDetails} getStage={this.getStage} />
            )}
            {contextType === "Table" && (
              <TableContext key={contextDetails.id} contextDetails={contextDetails} getStage={this.getStage} />
            )}
            {contextType === "Dimension" && (
              <TableContext key={contextDetails.id} contextDetails={contextDetails} getStage={this.getStage} />
            )}
            {contextType === "Fact" && (
              <TableContext key={contextDetails.id} contextDetails={contextDetails} getStage={this.getStage} />
            )}
          </div>
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    canvasWidth: state.edit.canvasWidth,
    canvasHeight: state.edit.canvasHeight,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCanvasSize: (width, height) => dispatch(EditActions.setCanvasSize(width, height)),
    showCanvasSizeDialog: (minCanvasWidth, minCanvasHeight) =>
      dispatch(EditActions.showCanvasSizeDialog(minCanvasWidth, minCanvasHeight)),
    importDiagramDialogCancel: () => dispatch(DiagramActions.importDiagramDialogCancel()),
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(StandalonePage)
  )
)
