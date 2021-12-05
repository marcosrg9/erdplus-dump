import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Header from "./Header"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import ReactGA from "react-ga"

const styles = theme => ({
  section: {
    height: "100%",
    display: "flex",
    flexFlow: "column"
  },
  title: {
    marginTop: 20,
    marginBottom: 10
  },
  words: {
    margin: 10
  },
  img: {
    boxShadow: "0 0 5px 0px",
    margin: 5,
    textAlign: "center"
  },
  contentArea: {
    height: "100%"
  }
})

class FaqPage extends Component {
  componentDidMount() {
    ReactGA.pageview("/faq")
  }

  render() {
    const { classes } = this.props

    return (
      <section className={classes.section}>
        <Header />
        <Grid container spacing={1}>
          <Grid item md={3} />
          <Grid item xs={12} md={6} className={classes.words}>
            <Typography variant="h5" className={classes.title}>
              How do I create a unary relationship in an ER Diagram?
            </Typography>
            <Typography variant="body1">
              Create a unary relationship by clicking on the relationship icon (diamond), placing the relationship
              diamond on the drawing surface, naming the relationship, choosing the same entity for Entity One and
              Entity Two in the Edit relationship dialog box, and choosing appropriate cardinality constraints.
            </Typography>
            <img
              alt="Set Entity One and Entity Two to the same entity for the relationship"
              src="UnaryRelationship.png"
              className={classes.img}
            />

            <Typography variant="h5" className={classes.title}>
              How do I make a ternary relationship in an ER Diagram?
            </Typography>
            <Typography variant="body1">
              In ERDPlus a ternary relationship is made using the associative entity feature. Here is an example of a
              ternary relationship.
            </Typography>
            <img alt="An associative entity" src="TernaryRelationship.png" className={classes.img} />

            <Typography variant="h5" className={classes.title}>
              How do I make a foreign key in a Relational Schema?
            </Typography>
            <Typography variant="body1">
              To create a foreign key, click on the connect button. Then click on the table where the foreign key is
              sourced from and drag to the table that is getting the foreign key. This sequence of actions is
              illustrated with the following three figures
            </Typography>
            <img alt="Use connect mode" src="RelationalSchemaFK1.png" className={classes.img} />
            <img
              alt="Draw a connecting line from one table to the other"
              src="RelationalSchemaFK2.png"
              className={classes.img}
            />
            <img alt="The completed foreign key" src="RelationalSchemaFK3.png" className={classes.img} />
          </Grid>
          <Grid item md={3} />
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
  )(FaqPage)
)
