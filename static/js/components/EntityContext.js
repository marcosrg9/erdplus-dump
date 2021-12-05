import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"

const erd = window.erd

const styles = theme => ({
  formControl: {
    marginTop: 16,
    width: "100%"
  },
  textField: {
    marginTop: 0,
    width: "100%"
  }
})

class EntityContext extends Component {
  state = {
    ...this.props.contextDetails,
    disjointed: this.props.contextDetails.isDisjointed ? 'd' : 'o'
  }

  handleNameChange = event => {
    const name = event.target.value
    const stage = this.props.getStage()
    stage.undoManager.startAction()

    const entity = stage.findById(this.props.contextDetails.id)
    entity.details.name = name
    stage.draw()
    this.setState({
      name
    })
  }

  handleTypeChange = event => {
    const type = event.target.value
    const stage = this.props.getStage()
    stage.undoManager.startAction()

    const entity = stage.findById(this.props.contextDetails.id)
    entity.details.type = type
    stage.draw()
    this.setState({
      type
    })
  }

  handleIsDisjointedChange = event => {
    const isDisjointed = event.target.value === 'd'
    const stage = this.props.getStage()
    stage.undoManager.startAction()

    const entity = stage.findById(this.props.contextDetails.id)
    entity.details.isDisjointed = isDisjointed
    stage.draw()
    this.setState({
      disjointed: isDisjointed ? 'd' : 'o'
    })
  }

  handleTotalSpecializationChange = () => {
    const isTotalSpecialization = !this.state.isTotalSpecialization
    const stage = this.props.getStage()
    stage.undoManager.startAction()

    const entity = stage.findById(this.props.contextDetails.id)
    entity.details.isTotalSpecialization = isTotalSpecialization
    stage.draw()
    this.setState({
      isTotalSpecialization
    })
  }

  handleAddAttribute = () => {
    const stage = this.props.getStage()
    if (!stage.undoManager.hasCurrentAction()) {
      stage.undoManager.startAction()
    }

    const entity = stage.findById(this.props.contextDetails.id)
    const pt = entity.getNextAutomaticPosition()
    const attribute = stage.factory.attribute({
      x: pt.x,
      y: pt.y,
      name: "NewAttribute"
    })

    stage.addItem(attribute)
    stage.connect.items(attribute, entity)
    stage.selectItem(attribute)
    stage.draw()
    stage.invokeDirtyCallback()
  }

  handleAddSubtype = () => {
    const stage = this.props.getStage()
    if (!stage.undoManager.hasCurrentAction()) {
      stage.undoManager.startAction()
    }

    const supertype = stage.findById(this.props.contextDetails.id)
    const pt = supertype.getNextAutomaticSubtypePosition()
    const subtype = stage.factory.entity({
      x: pt.x,
      y: pt.y,
      name: "Subtype Entity",
      isSubtype: true,
      supertypeEntityId: supertype.details.id
    })

    stage.addItem(subtype)
    stage.connect.items(subtype, supertype, {isSupertypeConnector: true})
    stage.selectItem(subtype)
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
    const { classes } = this.props

    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel>Entity Name</FormLabel>
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
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel>Type</FormLabel>
            <RadioGroup value={this.state.type} onChange={this.handleTypeChange}>
              <FormControlLabel value={erd.EntityType.Regular} control={<Radio />} label="Regular" />
              <FormControlLabel value={erd.EntityType.Weak} control={<Radio />} label="Weak" disabled={this.state.isSubtype} />
              <FormControlLabel value={erd.EntityType.Associative} control={<Radio />} label="Associative" disabled={this.state.isSubtype} />
              <FormControlLabel value={erd.EntityType.Supertype} control={<Radio />} label="Supertype" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" onClick={this.handleAddAttribute}>
            Add Attribute
          </Button>
        </Grid>
        {this.state.type === erd.EntityType.Supertype && (
          <Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel>Supertype</FormLabel>
                <RadioGroup value={this.state.disjointed} onChange={this.handleIsDisjointedChange}>
                  <FormControlLabel value={'d'} control={<Radio />} label="Disjointed" />
                  <FormControlLabel value={'o'} control={<Radio />} label="Overlapping" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel label="Total Specialization"
                control={
                  <Checkbox checked={this.state.isTotalSpecialization} onChange={this.handleTotalSpecializationChange} />
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={this.handleAddSubtype}>
                Add Subtype Entity
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EntityContext)
)
