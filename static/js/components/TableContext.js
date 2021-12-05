import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import Button from "@material-ui/core/Button"
import TableContextViewNormal from "./TableContextViewNormal"
import TableContextViewCheck from "./TableContextViewCheck"
import TableContextViewReorder from "./TableContextViewReorder"
import { withRouter } from "react-router-dom"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"

const styles = theme => ({
  tableContainer: {
    overflow: "auto"
  },
  cell: {
    textAlign: "center",
    paddingLeft: 0,
    paddingRight: 0
  },
  input: {
    width: "100%"
  },
  formControl: {
    marginTop: 16,
    width: "100%"
  },
  textField: {
    marginTop: 0,
    width: "100%"
  },
  mainButton: {
    width: "100%"
  }
})

const Modes = {
  Normal: "normal",
  Remove: "remove",
  Groups: "groups",
  Reorder: "reorder",
  PrimaryKey: "primaryKey",
  Unique: "unique",
  Optional: "optional"
}

/**
 * Important note to future me: Names are overloaded here.
 * "Tables" and "Column" are domain terms for Relational and Star diagram tables which contain columns.
 *
 * Tables and columns are also material-ui elements. Also graphically, domain columns are
 * represented as rows in the context panel.
 *
 * TableContext - the side bar when a table shape is selected. This displays the buttons, views, and handles different modes.
 * TableContextViewCheck - View for modes that list each domain column in a material-ui row with a checkbox.
 * TableContextViewReorder - View for the reorder mode
 * TableContextViewNormal - View for the normal mode. This mode lists each domain column as a material-ui row.
 *                          This also uses TableContextColumn and TableContextSelectedColumn.
 *
 */
class TableContext extends Component {
  state = {
    ...this.props.contextDetails,
    selectedAttributeId: 0,
    mode: Modes.Normal,
    checkedAttributeIds: [],
    currentGroupIndex: -1,
    menuAnchor: null
  }

  handleNameChange = event => {
    const name = event.target.value
    const stage = this.props.getStage()
    stage.undoManager.startAction()

    const table = stage.findById(this.props.contextDetails.id)
    table.details.name = name
    stage.draw()
    this.setState({
      name
    })
  }

  handleClickRow = attributeId => {
    this.setState({
      selectedAttributeId: attributeId,
      focusAttributeName: true
    })
  }

  //
  // Normal Attribute Details
  //

  handleAttributeNameChange = (name, index) => {
    const stage = this.props.getStage()
    stage.undoManager.startAction()
    const table = stage.findById(this.props.contextDetails.id)
    const selectedAttribute = table.getAttributeById(this.state.selectedAttributeId)
    selectedAttribute.names[index] = name
    stage.draw()

    this.setState({
      ...table.details,
      focusAttributeName: false
    })
  }

  handleAddAttribute = () => {
    const stage = this.props.getStage()
    stage.undoManager.startAction()
    const table = stage.findById(this.props.contextDetails.id)
    const attribute = table.addAttribute({
      names: ["New Column"]
    })
    stage.draw()

    this.setState({
      ...this.props.contextDetails,
      selectedAttributeId: attribute.id,
      focusAttributeName: true
    })
  }

  handleSetMode = mode => {
    this.setState({
      mode
    })
  }

  handleAttributeChecked = attributeId => {
    let ids = [...this.state.checkedAttributeIds]
    if (ids.includes(attributeId)) {
      ids = ids.filter(id => id !== attributeId)
    } else {
      ids = [...ids, attributeId]
    }

    this.setState({
      checkedAttributeIds: ids
    })
  }

  handleRemoveCheckedAttributes = () => {
    const stage = this.props.getStage()
    stage.undoManager.startAction()
    const table = stage.findById(this.props.contextDetails.id)
    const checkedAttributeIds = this.state.checkedAttributeIds
    checkedAttributeIds.forEach(id => {
      const attribute = table.getAttributeById(id)
      table.removeAttribute(attribute, stage)
    })

    this.handleEndAttributeChecks()
    stage.draw()
  }

  handleEndAttributeChecks = () => {
    this.setState({
      mode: Modes.Normal,
      checkedAttributeIds: []
    })
  }

  //
  // PrimaryKey
  //

  handlePrimaryKeyMode = () => {
    const stage = this.props.getStage()
    const table = stage.findById(this.props.contextDetails.id)
    const ids = table
      .getAttributesByOrder()
      .filter(a => a.pkMember)
      .map(a => a.id)

    this.setState({
      mode: Modes.PrimaryKey,
      checkedAttributeIds: ids
    })
  }

  /**
   * Set the new PK on the table
   */
  handleSavePrimaryKeyChecks = () => {
    const stage = this.props.getStage()
    const table = stage.findById(this.props.contextDetails.id)
    table.removePkConnectors(stage)
    const allAttributeIds = table.getAttributesByOrder().map(a => a.id)
    allAttributeIds.forEach(id => {
      const attr = table.getAttributeById(id)
      attr.pkMember = this.state.checkedAttributeIds.includes(attr.id)
      if (attr.pkMember) {
        attr.optional = false
      }
    })
    stage.draw()
    stage.invokeDirtyCallback()

    this.setState({
      ...this.props.contextDetails,
      mode: Modes.Normal,
      checkedAttributeIds: []
    })
  }

  handleCancelPrimaryKeyChecks = () => {
    this.setState({
      mode: Modes.Normal,
      checkedAttributeIds: []
    })
  }

  //
  // Optional Mode
  //

  handleOptionalMode = () => {
    const stage = this.props.getStage()
    const table = stage.findById(this.props.contextDetails.id)
    const ids = table
      .getAttributesByOrder()
      .filter(a => a.optional)
      .map(a => a.id)

    this.setState({
      mode: Modes.Optional,
      checkedAttributeIds: ids
    })
  }

  handleSaveOptionalMode = () => {
    const stage = this.props.getStage()
    const table = stage.findById(this.props.contextDetails.id)
    const allAttributeIds = table.getAttributesByOrder().map(a => a.id)
    allAttributeIds.forEach(id => {
      const attr = table.getAttributeById(id)
      attr.optional = this.state.checkedAttributeIds.includes(attr.id)
    })
    stage.draw()
    stage.invokeDirtyCallback()

    this.setState({
      ...this.props.contextDetails,
      mode: Modes.Normal,
      checkedAttributeIds: []
    })
  }

  handleCancelOptionalMode = () => {
    this.setState({
      mode: Modes.Normal,
      checkedAttributeIds: []
    })
  }

  //
  // Unique Mode
  //

  handleUniqueMode = () => {
    const stage = this.props.getStage()
    const table = stage.findById(this.props.contextDetails.id)
    const ids = table
      .getAttributesByOrder()
      .filter(a => a.soloUnique)
      .map(a => a.id)

    this.setState({
      mode: Modes.Unique,
      checkedAttributeIds: ids
    })
  }

  handleSaveUniqueMode = () => {
    const stage = this.props.getStage()
    const table = stage.findById(this.props.contextDetails.id)
    const allAttributeIds = table.getAttributesByOrder().map(a => a.id)
    allAttributeIds.forEach(id => {
      const attr = table.getAttributeById(id)
      attr.soloUnique = this.state.checkedAttributeIds.includes(attr.id)
    })
    stage.draw()
    stage.invokeDirtyCallback()

    this.setState({
      ...this.props.contextDetails,
      mode: Modes.Normal,
      checkedAttributeIds: []
    })
  }

  handleCancelUniqueMode = () => {
    this.setState({
      mode: Modes.Normal,
      checkedAttributeIds: []
    })
  }

  //
  // Unique Groups
  //

  handleEditGroup = currentGroupIndex => {
    const checkedAttributeIds = currentGroupIndex >= 0 ? this.state.uniqueGroups[currentGroupIndex] : []
    this.setState({
      currentGroupIndex,
      checkedAttributeIds
    })
    this.handleMenuClose()
    this.handleSetMode(Modes.Groups)
  }

  handleAddGroup = () => {
    const stage = this.props.getStage()
    stage.undoManager.startAction()
    const table = stage.findById(this.props.contextDetails.id)
    table.details.uniqueGroups.push([])
    stage.draw()

    const currentGroupIndex = table.details.uniqueGroups.length - 1
    this.setState({
      currentGroupIndex,
      checkedAttributeIds: [],
      contextDetails: table.details
    })
    this.handleMenuClose()
    this.handleSetMode(Modes.Groups)
  }

  handleRemoveGroup = () => {
    let currentGroupIndex = this.state.currentGroupIndex
    const stage = this.props.getStage()
    stage.undoManager.startAction()
    const table = stage.findById(this.props.contextDetails.id)
    table.details.uniqueGroups.splice(currentGroupIndex, 1)
    stage.draw()

    currentGroupIndex = Math.min(currentGroupIndex, table.details.uniqueGroups.lenght - 1)
    const checkedAttributeIds = currentGroupIndex >= 0 ? this.state.uniqueGroups[currentGroupIndex] : []
    this.setState({
      currentGroupIndex,
      contextDetails: table.details,
      checkedAttributeIds
    })
    this.handleSetMode(Modes.Normal)
  }

  handleGroupAttributeChecked = attributeId => {
    let ids = [...this.state.checkedAttributeIds]
    if (ids.includes(attributeId)) {
      ids = ids.filter(id => id !== attributeId)
    } else {
      ids = [...ids, attributeId]
    }

    const stage = this.props.getStage()
    stage.undoManager.startAction()
    const table = stage.findById(this.props.contextDetails.id)
    table.details.uniqueGroups[this.state.currentGroupIndex] = ids
    stage.draw()

    this.setState({
      contextDetails: table.details,
      checkedAttributeIds: ids
    })
  }

  //
  // (U) Groups Menu
  //

  handleMenuOpen = target => {
    this.setState({
      menuAnchor: target
    })
  }

  handleMenuClose = () => {
    this.setState({
      menuAnchor: null
    })
  }

  //
  // Datatypes
  //

  handleDataTypeChange = event => {
    const stage = this.props.getStage()
    stage.undoManager.startAction()
    const table = stage.findById(this.props.contextDetails.id)
    const selectedAttribute = table.getAttributeById(this.state.selectedAttributeId)
    selectedAttribute.dataType = event.target.value
    selectedAttribute.dataTypeSize = ""
    stage.draw()

    this.setState({
      ...this.props.contextDetails,
      focusAttributeName: false
    })
  }

  handleDataTypeSizeChange = event => {
    const stage = this.props.getStage()
    stage.undoManager.startAction()
    const table = stage.findById(this.props.contextDetails.id)
    const selectedAttribute = table.getAttributeById(this.state.selectedAttributeId)
    selectedAttribute.dataTypeSize = event.target.value
    stage.draw()

    this.setState({
      ...this.props.contextDetails,
      focusAttributeName: false
    })
  }

  //
  // Reorder
  //

  handleEndAttributeReorder = () => {
    this.setState({
      mode: Modes.Normal
    })
  }

  handleAttributeOrderSwap = (attributeId, otherAttributeId) => {
    const stage = this.props.getStage()
    stage.undoManager.startAction()
    const table = stage.findById(this.props.contextDetails.id)

    table.details.sort = "manual"

    // Find the two attributes and swap order
    const attr1 = table.getAttributeById(attributeId)
    const attr2 = table.getAttributeById(otherAttributeId)

    if (attr1.order === attr2.order) {
      // Need to renumber the order values
      const sortedAttributes = table.getAttributesByOrder()
      sortedAttributes.forEach((a, i) => {
        a.order = i
      })
    }

    const order = attr1.order
    attr1.order = attr2.order
    attr2.order = order

    table.updateAllAnchors()
    stage.draw()

    this.setState({
      contextDetails: table.details
    })
  }

  handleAddRecursiveKey = () => {
    const stage = this.props.getStage()
    stage.undoManager.startAction()
    const table = stage.findById(this.props.contextDetails.id)
    stage.connect.items(table, table)
    table.updateAllAnchors()
    stage.draw()

    this.setState({
      contextDetails: table.details
    })
  }

  componentDidMount() {
    const input = this.nameTextField
    setTimeout(() => {
      input.focus()
      input.select()
    }, 0)
  }

  //
  // Render
  //

  render() {
    const { classes } = this.props

    const { menuAnchor, uniqueGroups, selectedAttributeId, focusAttributeName, mode, checkedAttributeIds, currentGroupIndex } = this.state

    const stage = this.props.getStage()
    const table = stage.findById(this.props.contextDetails.id)
    const sortedAttributes = table.getAttributesByOrder()

    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel>Table Name</FormLabel>
            <TextField
              id="name"
              margin="normal"
              autoComplete="off"
              value={this.state.name}
              onChange={this.handleNameChange}
              inputProps={{ ref: elem => this.nameTextField = elem }}
              className={classes.textField}
            />
          </FormControl>
        </Grid>

        {mode === Modes.Normal && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handlePrimaryKeyMode}>
                  Primary Key
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  aria-owns={menuAnchor ? "ugroups-menu" : null}
                  variant="outlined"
                  className={classes.mainButton}
                  onClick={event => this.handleMenuOpen(event.currentTarget)}>
                  (U) Groups ...
                </Button>
                <Menu id="ugroups-menu" open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={this.handleMenuClose}>
                  <MenuItem onClick={this.handleAddGroup}>Add New Unique Group</MenuItem>
                  {uniqueGroups.map((group, index) => (
                    <MenuItem key={index} value={index} onClick={() => this.handleEditGroup(index)}>
                      Edit Unique Group {index + 1}
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleAddRecursiveKey}>
                  Recursive Key
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  className={classes.mainButton}
                  onClick={() => this.handleSetMode(Modes.Reorder)}>
                  Reorder ...
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleUniqueMode}>
                  Unique ...
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleOptionalMode}>
                  Optional ...
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Columns</FormLabel>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleAddAttribute}>
                  Add
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  className={classes.mainButton}
                  onClick={() => this.handleSetMode(Modes.Remove)}>
                  Remove ...
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}

        {mode === Modes.PrimaryKey && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleSavePrimaryKeyChecks}>
                  Save
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleCancelPrimaryKeyChecks}>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Select columns for the Primary Key</FormLabel>
              </Grid>
            </Grid>
          </Grid>
        )}

        {mode === Modes.Remove && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleRemoveCheckedAttributes}>
                  Remove
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleEndAttributeChecks}>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Select columns to remove</FormLabel>
              </Grid>
            </Grid>
          </Grid>
        )}

        {mode === Modes.Unique && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleSaveUniqueMode}>
                  Save
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleCancelUniqueMode}>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Select Unique columns</FormLabel>
              </Grid>
            </Grid>
          </Grid>
        )}

        {mode === Modes.Optional && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleSaveOptionalMode}>
                  Save
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleCancelOptionalMode}>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Select Optional columns</FormLabel>
              </Grid>
            </Grid>
          </Grid>
        )}

        {mode === Modes.Reorder && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleEndAttributeReorder}>
                  Done
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}

        {mode === Modes.Groups && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormLabel>Edit Unique Group {currentGroupIndex + 1}</FormLabel>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleRemoveGroup}>
                  Remove
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" className={classes.mainButton} onClick={this.handleEndAttributeChecks}>
                  Done
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}

        <Grid item xs={12}>
          <div className={classes.tableContainer}>
            {mode === Modes.Normal && (
              <TableContextViewNormal
                attributes={sortedAttributes}
                selectedAttributeId={selectedAttributeId}
                focusAttributeName={focusAttributeName}
                handleAttributeNameChange={this.handleAttributeNameChange}
                handleClickRow={this.handleClickRow}
                handleDataTypeChange={this.handleDataTypeChange}
                handleDataTypeSizeChange={this.handleDataTypeSizeChange}
              />
            )}

            {mode === Modes.Remove && (
              <TableContextViewCheck
                attributes={sortedAttributes}
                checkedAttributeIds={checkedAttributeIds}
                handleAttributeChecked={this.handleAttributeChecked}
              />
            )}

            {mode === Modes.PrimaryKey && (
              <TableContextViewCheck
                attributes={sortedAttributes}
                checkedAttributeIds={checkedAttributeIds}
                handleAttributeChecked={this.handleAttributeChecked}
              />
            )}

            {mode === Modes.Unique && (
              <TableContextViewCheck
                attributes={sortedAttributes}
                checkedAttributeIds={checkedAttributeIds}
                handleAttributeChecked={this.handleAttributeChecked}
              />
            )}

            {mode === Modes.Optional && (
              <TableContextViewCheck
                attributes={sortedAttributes}
                checkedAttributeIds={checkedAttributeIds}
                handleAttributeChecked={this.handleAttributeChecked}
                disabledAttributes={sortedAttributes.filter(a => a.pkMember)}
              />
            )}

            {mode === Modes.Groups && (
              <TableContextViewCheck
                attributes={sortedAttributes}
                checkedAttributeIds={checkedAttributeIds}
                handleAttributeChecked={this.handleGroupAttributeChecked}
              />
            )}

            {mode === Modes.Reorder && (
              <TableContextViewReorder
                attributes={sortedAttributes}
                handleAttributeMoveUp={this.handleAttributeOrderSwap}
                handleAttributeMoveDown={this.handleAttributeOrderSwap}
              />
            )}
          </div>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(TableContext)
  )
)
