import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Header from "./Header"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"

const styles = theme => ({
  section: {
    height: "100%",
    display: "flex",
    flexFlow: "column"
  },
  center: {
    textAlign: "center",
    marginTop: 25
  }
})

class Missing404Page extends Component {
  render() {
    const { classes } = this.props

    return (
      <section className={classes.section}>
        <Header />
        <Grid container spacing={1}>
          <Grid item xs={12} className={classes.center}>
            <Typography variant="h3">404</Typography>
          </Grid>
          <Grid item xs={12} className={classes.center}>
            <Typography variant="h3">Page Not Found</Typography>
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Missing404Page)
)
