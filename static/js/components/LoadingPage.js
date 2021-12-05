import React, { Component } from "react"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import AutoRenew from "@material-ui/icons/Autorenew"

const styles = theme => ({
  section: {
    height: "100%",
    display: "flex",
    flexFlow: "column",
    backgroundColor: "#d0d0d0"
  },
  "@keyframes rotator": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" }
  },
  spinner: {
    animation: "$rotator 1.4s linear infinite",
    width: 125,
    height: 125,
    color: "#4C3310"
  },
  center: {
    textAlign: "center"
  }
})

class LoadingPage extends Component {
  componentDidMount() {}

  render() {
    const { classes } = this.props

    return (
      <section className={classes.section}>
        <Grid container spacing={1}>
          <Grid item xs={12} className={classes.center}>
            <AutoRenew className={classes.spinner} />
          </Grid>
          <Grid item xs={12} className={classes.center}>
            <Typography variant="h4">Loading</Typography>
          </Grid>
        </Grid>
      </section>
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
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(LoadingPage)
  )
)
