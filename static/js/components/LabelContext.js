import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"

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

class LabelContext extends Component {
  state = {
    ...this.props.contextDetails
  }

  handleTextChange = event => {
    const text = event.target.value
    const stage = this.props.getStage()
    stage.undoManager.startAction()

    const label = stage.findById(this.props.contextDetails.id)
    label.details.text = text
    stage.draw()
    this.setState({
      text
    })
  }

  componentDidMount() {
    const input = this.textField
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
            <FormLabel>Text Label</FormLabel>
            <TextField
              id="text"
              margin="normal"
              autoComplete="off"
              value={this.state.text}
              onChange={this.handleTextChange}
              multiline
              variant="outlined"
              maxrows={10}
              inputProps={{ ref: elem => this.textField = elem }}
              className={classes.textField}
            />
          </FormControl>
        </Grid>
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
  )(LabelContext)
)
