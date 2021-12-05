import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { getEditDiagram } from "../selectors/diagramsSelector"
import Header from "./Header"
import ButtonBar from "./ButtonBar"
import EditActions from "../redux/Edit"
import CanvasSizeDialog from "./CanvasSizeDialog"
import ExportImageDialog from "./ExportImageDialog"
import { withRouter } from "react-router-dom"
import EntityContext from "./EntityContext"
import AttributeContext from "./AttributeContext"
import RelationshipContext from "./RelationshipContext"
import LabelContext from "./LabelContext"
import TableContext from "./TableContext"
import ReactGA from "react-ga"

const erd = window.erd
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

class EditDiagramPage extends Component {
  constructor() {
    super()
    this.isReady = false
    this.autoSaveTimer = null
    this.canvasElement = React.createRef()
  }

  tryLoadDiagram = () => {
    const { editDiagram, setCanvasSize } = this.props

    if (!this.isReady && editDiagram) {
      this.isReady = true
      const archive = new erd.DiagramArchive(this.stage)
      const data = archive.fromJson(editDiagram.content)
      if (typeof data.width === "number" && typeof data.height === "number") {
        setCanvasSize(data.width, data.height)
      }
    }

    if (this.stage && this.isReady) {
      setTimeout(() => this.stage.draw(), 0)
    }

    this.setUndoRedo()
  }

  setUndoRedo = () => {
    if (this.stage) {
      this.props.setUndoRedo(this.stage.undoManager.canUndo(), this.stage.undoManager.canRedo())
    }
  }

  activeItemChangedCallback = (item) => {
    if (this.stage.undoManager.hasCurrentAction()) {
      this.stage.undoManager.endAction()
    }

    if (item) {
      // emit action with item.getType() and item.details to show context
      this.props.setContext(item.details, item.getType())
    } else {
      // emit action with no item to hide context
      this.props.clearContext()
    }

    //

    // $scope.$broadcast("endContextEdit");
    // if (item !== null) {
    //   $scope.$broadcast("startContextEdit", item);
    // }
    // $scope.$apply();
  }

  startMoveCallback = () => {
    if (this.stage.undoManager.hasCurrentAction()) {
      this.stage.undoManager.endAction()
    }

    this.stage.undoManager.startAction()

    // $scope.$broadcast("commitContextEdit");
    // $scope.stage.undoManager.startAction();
    // $scope.$apply();

    // // Prevent auto save during drag
    // if ($scope.autoSavePromise !== null) {
    //   $timeout.cancel($scope.autoSavePromise);
    // }
  }

  endMoveCallback = () => {
    this.stage.undoManager.endAction()
    this.dirtyCallback()
    // $scope.$apply();
    // $scope.stageDirty();
  }

  connectModeEndCallback = () => {
    // $scope.$apply();
  }

  dirtyCallback = () => {
    this.setUndoRedo()
    this.props.setIsDirty(true)

    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer)
      this.autoSaveTimer = null
    }
    this.autoSaveTimer = setTimeout(this.handleSave, 8000)

    // if ($scope.saveState === "clean") {
    //   $scope.saveState = "dirty";
    // }
    // $scope.pendingSaveState = "dirty";

    // // Cancel existing pending save timer
  }

  handleSave = () => {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer)
      this.autoSaveTimer = null
    }

    const { saveEditDiagram, editDiagram } = this.props

    const archive = new erd.DiagramArchive(this.stage)

    const diagram = { ...editDiagram, content: archive.toJson() }
    saveEditDiagram(diagram)
  }

  mouseModeResetCallback = (mouseMode) => {
    this.props.setMouseMode(mouseMode)
  }

  selectedCountChange = () => {
    this.props.setCanDelete(this.stage.selectedCount())
  }

  componentDidMount() {
    ReactGA.pageview("/edit-diagram")

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
    this.tryLoadDiagram()
  }

  componentDidUpdate() {
    this.tryLoadDiagram()
  }

  componentWillUnmount() {
    this.props.clearContext()
    if (this.autoSaveTimer) {
      this.handleSave()
    }
  }

  getStage = () => {
    return this.stage
  }

  render() {
    const { classes, editDiagram, canvasWidth, canvasHeight, contextType, contextDetails, mouseMode } = this.props

    const diagramType = editDiagram ? editDiagram.diagramType : "none"

    let canvasClasses = [classes.canvas]
    if (mouseMode === "connect") {
      canvasClasses.push(classes.canvasConnectMode)
    }

    return (
      <section className={classes.section}>
        <Header />
        <CanvasSizeDialog />
        <ExportImageDialog getStage={this.getStage} />
        <ButtonBar diagramType={diagramType} getStage={this.getStage} handleSave={this.handleSave} />
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
    editDiagram: getEditDiagram(state, props),
    canvasWidth: state.edit.canvasWidth,
    canvasHeight: state.edit.canvasHeight,
    contextDetails: state.edit.contextDetails,
    contextType: state.edit.contextType,
    mouseMode: state.edit.mouseMode,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setContext: (contextDetails, contextType) => dispatch(EditActions.setContext(contextDetails, contextType)),
    setIsDirty: (isDirty) => dispatch(EditActions.setIsDirty(isDirty)),
    clearContext: () => dispatch(EditActions.clearContext()),
    setMouseMode: (mouseMode) => dispatch(EditActions.setMouseMode(mouseMode)),
    setUndoRedo: (canUndo, canRedo) => dispatch(EditActions.setUndoRedo(canUndo, canRedo)),
    setCanDelete: (canDelete) => dispatch(EditActions.setCanDelete(canDelete)),
    setCanvasSize: (width, height) => dispatch(EditActions.setCanvasSize(width, height)),
    saveEditDiagram: (diagram) => dispatch(EditActions.saveEditDiagram(diagram)),
  }
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(EditDiagramPage)
  )
)
