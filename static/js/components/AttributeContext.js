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
import Checkbox from "@material-ui/core/Checkbox"

const styles = (theme) => ({
  formControl: {
    marginTop: 16,
    width: "100%",
  },
  textField: {
    marginTop: 0,
    width: "100%",
  },
})

class AttributeContext extends Component {
  state = {
    ...this.props.contextDetails,
  }

  handleNameChange = (event) => {
    const name = event.target.value
    const stage = this.props.getStage()
    stage.undoManager.startAction()

    const attribute = stage.findById(this.props.contextDetails.id)
    attribute.details.name = name
    stage.draw()
    this.setState({
      name,
    })
  }

  handleFlagChange = (name) => (event) => {
    const stage = this.props.getStage()
    const attribute = stage.findById(this.props.contextDetails.id)
    stage.undoManager.startAction()

    if (name === "isComposite") {
      attribute.removeAllChildAttributes(stage)
    }

    const flag = !attribute.details[name]
    attribute.details[name] = flag
    stage.draw()
    this.setState({
      [name]: flag,
    })
  }

  handleAddAttributeToEntity = () => {
    const stage = this.props.getStage()
    if (!stage.undoManager.hasCurrentAction()) {
      stage.undoManager.startAction()
    }

    const attribute = stage.findById(this.props.contextDetails.id)
    const owner = attribute.getOwner()
    const pt = owner.getNextAutomaticPosition()
    const newAttribute = stage.factory.attribute({
      x: pt.x,
      y: pt.y,
      name: "NewAttribute",
    })

    stage.addItem(newAttribute)
    stage.connect.items(newAttribute, owner)
    stage.selectItem(newAttribute)
    stage.draw()
    stage.invokeDirtyCallback()
  }

  handleAddComponentAttribute = () => {
    const stage = this.props.getStage()
    if (!stage.undoManager.hasCurrentAction()) {
      stage.undoManager.startAction()
    }

    const attribute = stage.findById(this.props.contextDetails.id)
    const pt = attribute.getNextAutomaticPosition()
    const newAttribute = stage.factory.attribute({
      x: pt.x,
      y: pt.y,
      name: "NewAttribute",
    })
    stage.addItem(newAttribute)
    stage.connect.items(newAttribute, attribute)
    stage.selectItem(newAttribute)
    stage.draw()
    stage.invokeDirtyCallback()
  }

  handleAddAttributeToComposite = () => {
    const stage = this.props.getStage()
    if (!stage.undoManager.hasCurrentAction()) {
      stage.undoManager.startAction()
    }

    const attribute = stage.findById(this.props.contextDetails.id)
    const owner = attribute.getOwner()
    const pt = owner.getNextAutomaticPosition()
    const newAttribute = stage.factory.attribute({
      x: pt.x,
      y: pt.y,
      name: "NewAttribute",
    })

    stage.addItem(newAttribute)
    stage.connect.items(newAttribute, owner)
    stage.selectItem(newAttribute)
    stage.draw()
    stage.invokeDirtyCallback()
  }

  handleAddAttributeToRelationship = () => {
    const stage = this.props.getStage()
    if (!stage.undoManager.hasCurrentAction()) {
      stage.undoManager.startAction()
    }

    const attribute = stage.findById(this.props.contextDetails.id)
    const owner = attribute.getOwner()
    const pt = owner.getNextAutomaticPosition()
    const newAttribute = stage.factory.attribute({
      x: pt.x,
      y: pt.y,
      name: "NewAttribute",
    })

    stage.addItem(newAttribute)
    stage.connect.items(newAttribute, owner)
    stage.selectItem(newAttribute)
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
    const attribute = stage.findById(this.props.contextDetails.id)
    const owner = attribute.getOwner()
    const isParentEntity = owner && owner.getType() === "Entity"
    const isParentRelationship = owner && owner.getType() === "Relationship"
    const isComposite = this.state.isComposite
    const isParentComposite = owner && owner.getType() === "Attribute" && owner.details.isComposite
    const isParentWeakEntity = isParentEntity && owner.details.type === "weak"

    const { classes } = this.props

    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel>Attribute Name</FormLabel>
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
            <FormGroup>
              <FormControlLabel
                label={isParentWeakEntity ? "Partially Unique" : "Unique"}
                control={<Checkbox checked={this.state.isUnique} onChange={this.handleFlagChange("isUnique")} />}
              />
              <FormControlLabel
                label="Multivalued"
                control={
                  <Checkbox checked={this.state.isMultivalued} onChange={this.handleFlagChange("isMultivalued")} />
                }
              />
              <FormControlLabel
                label="Optional"
                control={<Checkbox checked={this.state.isOptional} onChange={this.handleFlagChange("isOptional")} />}
              />
              <FormControlLabel
                label="Composite"
                control={<Checkbox checked={this.state.isComposite} onChange={this.handleFlagChange("isComposite")} />}
              />
              <FormControlLabel
                label="Derived"
                control={<Checkbox checked={this.state.isDerived} onChange={this.handleFlagChange("isDerived")} />}
              />
            </FormGroup>
          </FormControl>
        </Grid>

        {isParentEntity && (
          <Grid item xs={12}>
            <Button variant="outlined" onClick={this.handleAddAttributeToEntity}>
              Add Attribute to Entity
            </Button>
          </Grid>
        )}

        {isParentRelationship && (
          <Grid item xs={12}>
            <Button variant="outlined" onClick={this.handleAddAttributeToRelationship}>
              Add Attribute to Relationship
            </Button>
          </Grid>
        )}

        {isComposite && (
          <Grid item xs={12}>
            <Button variant="outlined" onClick={this.handleAddComponentAttribute}>
              Add Component Attribute
            </Button>
          </Grid>
        )}

        {isParentComposite && (
          <Grid item xs={12}>
            <Button variant="outlined" onClick={this.handleAddAttributeToComposite}>
              Add Attribute to Composite
            </Button>
          </Grid>
        )}
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AttributeContext)
)
