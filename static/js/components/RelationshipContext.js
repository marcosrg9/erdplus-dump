import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import Button from "@material-ui/core/Button"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import Checkbox from "@material-ui/core/Checkbox"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import Switch from "@material-ui/core/Switch"
import { withRouter } from "react-router-dom"

const erd = window.erd

const styles = theme => ({
  formControl: {
    marginTop: 0,
    width: "100%"
  },
  textField: {
    marginTop: 0,
    width: "100%"
  }
})

class RelationshipContext extends Component {
  state = {
    name: this.props.contextDetails.name,
    isIdentifying: this.props.contextDetails.isIdentifying,
    slot0: this.props.contextDetails.slots[0],
    slot1: this.props.contextDetails.slots[1],
    showExact: false
  }

  handleShowExactChange = event => {
    const showExact = !this.state.showExact
    this.setState({
      showExact
    })
  }

  handleNameChange = event => {
    const name = event.target.value
    const stage = this.props.getStage()
    stage.undoManager.startAction()

    const relationship = stage.findById(this.props.contextDetails.id)
    relationship.details.name = name
    stage.draw()
    this.setState({
      name
    })
  }

  handleIdentifyingChange = event => {
    const stage = this.props.getStage()
    stage.undoManager.startAction()

    const relationship = stage.findById(this.props.contextDetails.id)
    relationship.details.isIdentifying = !relationship.details.isIdentifying
    stage.draw()
    this.setState({
      isIdentifying: relationship.details.isIdentifying
    })
  }

  handleChangeEntity = slotIndex => event => {
    const slotName = `slot${slotIndex}`
    const stage = this.props.getStage()
    stage.undoManager.startAction()
    const relationship = stage.findById(this.props.contextDetails.id)

    const slot = this.state[slotName]
    const newEntityId = event.target.value

    if (newEntityId !== slot.entityId) {
      // Remove old connector
      if (slot.entityId !== 0) {
        const connector = relationship.getSlotConnector(slotIndex)
        if (connector) {
          connector.removeFromStage(stage)
        }
      }

      // Create new connector
      if (newEntityId > 0) {
        const entity = stage.findById(newEntityId)
        stage.connect.items(entity, relationship, { slotIndex })
      }

      // Always set new entityId
      this.setState({
        [slotName]: {
          ...slot,
          entityId: newEntityId
        }
      })
      stage.invokeDirtyCallback()
      stage.draw()
    }
  }

  handleMinimumChange = slotIndex => event => {
    const slotName = `slot${slotIndex}`
    const stage = this.props.getStage()
    const relationship = stage.findById(this.props.contextDetails.id)
    stage.undoManager.startAction()
    const slot = this.state[slotName]

    relationship.details.slots[slotIndex].minimum = event.target.value
    stage.invokeDirtyCallback()
    stage.draw()

    this.setState({
      [slotName]: {
        ...slot,
        minimum: event.target.value
      }
    })
  }

  handleMaximumChange = slotIndex => event => {
    const slotName = `slot${slotIndex}`
    const stage = this.props.getStage()
    const relationship = stage.findById(this.props.contextDetails.id)
    stage.undoManager.startAction()
    const slot = this.state[slotName]

    relationship.details.slots[slotIndex].maximum = event.target.value
    stage.invokeDirtyCallback()
    stage.draw()

    this.setState({
      [slotName]: {
        ...slot,
        maximum: event.target.value
      }
    })
  }

  handleRoleChange = slotIndex => event => {
    const slotName = `slot${slotIndex}`
    const stage = this.props.getStage()
    const relationship = stage.findById(this.props.contextDetails.id)
    stage.undoManager.startAction()
    const slot = this.state[slotName]

    relationship.details.slots[slotIndex].role = event.target.value
    stage.invokeDirtyCallback()
    stage.draw()

    this.setState({
      [slotName]: {
        ...slot,
        role: event.target.value
      }
    })
  }

  handleParticipationChange = slotIndex => event => {
    const slotName = `slot${slotIndex}`
    const stage = this.props.getStage()
    const relationship = stage.findById(this.props.contextDetails.id)
    stage.undoManager.startAction()
    const slot = this.state[slotName]

    relationship.details.slots[slotIndex].participation = event.target.value
    stage.invokeDirtyCallback()
    stage.draw()

    this.setState({
      [slotName]: {
        ...slot,
        participation: event.target.value
      }
    })
  }

  handleCardinalityChange = slotIndex => event => {
    const slotName = `slot${slotIndex}`
    const stage = this.props.getStage()
    const relationship = stage.findById(this.props.contextDetails.id)
    stage.undoManager.startAction()
    const slot = this.state[slotName]

    relationship.details.slots[slotIndex].cardinality = event.target.value
    stage.invokeDirtyCallback()
    stage.draw()

    this.setState({
      [slotName]: {
        ...slot,
        cardinality: event.target.value
      }
    })
  }

  handleAddAttribute = () => {
    const stage = this.props.getStage()
    if (!stage.undoManager.hasCurrentAction()) {
      stage.undoManager.startAction()
    }

    const relationship = stage.findById(this.props.contextDetails.id)
    const pt = relationship.getNextAutomaticPosition()
    const attribute = stage.factory.attribute({
      x: pt.x,
      y: pt.y,
      name: "NewAttribute"
    })

    stage.addItem(attribute)
    stage.connect.items(attribute, relationship)
    stage.selectItem(attribute)
    stage.draw()
    stage.invokeDirtyCallback()
  }

  componentDidMount() {
    const input = this.nameTextField
    setTimeout(() => {
      input.focus()
      input.select()
    }, 0)
  }

  render() {
    const stage = this.props.getStage()
    const entities = stage.findAllByType("Entity")
    const { showExact, slot0, slot1 } = this.state
    const { classes } = this.props

    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel>Relationship Name</FormLabel>
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
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                label="Identifying"
                control={<Checkbox checked={this.state.isIdentifying} onChange={this.handleIdentifyingChange} />}
              />
            </FormGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormLabel>Entity One</FormLabel>
        </Grid>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <Select value={slot0.entityId} onChange={this.handleChangeEntity(0)} displayEmpty name="entity1">
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              {entities.map(e => (
                <MenuItem key={e.details.id} value={e.details.id}>
                  {e.details.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {!showExact && (
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <RadioGroup value={slot0.participation} onChange={this.handleParticipationChange(0)}>
                <FormControlLabel value={erd.ParticipationType.mandatory} control={<Radio />} label="Mandatory" />
                <FormControlLabel value={erd.ParticipationType.optional} control={<Radio />} label="Optional" />
                <FormControlLabel value={erd.ParticipationType.unspecified} control={<Radio />} label="Unspecified" />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
        {!showExact && (
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <RadioGroup value={slot0.cardinality} onChange={this.handleCardinalityChange(0)}>
                <FormControlLabel value={erd.CardinalityType.one} control={<Radio />} label="One" />
                <FormControlLabel value={erd.CardinalityType.many} control={<Radio />} label="Many" />
                <FormControlLabel value={erd.CardinalityType.unspecified} control={<Radio />} label="Unspecified" />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
        {showExact && (
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <TextField
                id="slot0min"
                label="Minimum"
                margin="normal"
                autoComplete="off"
                value={slot0.minimum}
                onChange={this.handleMinimumChange(0)}
              />
              <TextField
                id="slot0max"
                label="Maximum"
                margin="normal"
                autoComplete="off"
                value={slot0.maximum}
                onChange={this.handleMaximumChange(0)}
              />
              <TextField
                id="slot0role"
                label="Role"
                margin="normal"
                autoComplete="off"
                value={slot0.role}
                onChange={this.handleRoleChange(0)}
              />
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12}>
          <FormLabel>Entity Two</FormLabel>
        </Grid>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <Select value={slot1.entityId} onChange={this.handleChangeEntity(1)} displayEmpty name="entity1">
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              {entities.map(e => (
                <MenuItem key={e.details.id} value={e.details.id}>
                  {e.details.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {!showExact && (
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <RadioGroup value={slot1.participation} onChange={this.handleParticipationChange(1)}>
                <FormControlLabel value={erd.ParticipationType.mandatory} control={<Radio />} label="Mandatory" />
                <FormControlLabel value={erd.ParticipationType.optional} control={<Radio />} label="Optional" />
                <FormControlLabel value={erd.ParticipationType.unspecified} control={<Radio />} label="Unspecified" />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
        {!showExact && (
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <RadioGroup value={slot1.cardinality} onChange={this.handleCardinalityChange(1)}>
                <FormControlLabel value={erd.CardinalityType.one} control={<Radio />} label="One" />
                <FormControlLabel value={erd.CardinalityType.many} control={<Radio />} label="Many" />
                <FormControlLabel value={erd.CardinalityType.unspecified} control={<Radio />} label="Unspecified" />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
        {showExact && (
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <TextField
                id="slot1min"
                label="Minimum"
                margin="normal"
                autoComplete="off"
                value={slot1.minimum}
                onChange={this.handleMinimumChange(1)}
              />
              <TextField
                id="slot1max"
                label="Maximum"
                margin="normal"
                autoComplete="off"
                value={slot1.maximum}
                onChange={this.handleMaximumChange(1)}
              />
              <TextField
                id="slot1role"
                label="Role"
                margin="normal"
                autoComplete="off"
                value={slot1.role}
                onChange={this.handleRoleChange(1)}
              />
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={this.state.showExact} onChange={this.handleShowExactChange} color="primary" />}
            label="Edit Exact Constraints"
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="outlined" onClick={this.handleAddAttribute}>
            Add Attribute
          </Button>
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
    )(RelationshipContext)
  )
)
