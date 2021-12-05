import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Header from "./Header"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import { Link } from "react-router-dom"
import { date, stage, checksum } from "../version"
import ReactGA from "react-ga"

const sql = `CREATE TABLE PRODUCT
(
  ProductID INT NOT NULL,
  ProductName VARCHAR(64) NOT NULL,
  ProductPrice DECIMAL(4, 2) NOT NULL,
  PRIMARY KEY (ProductID)
);

CREATE TABLE CUSTOMER
(
  CustomerID INT NOT NULL,
  CustomerName VARCHAR(40) NOT NULL,
  CustomerZip VARCHAR(10) NOT NULL,
  PRIMARY KEY (CustomerID)
);

CREATE TABLE SALESTRANSACTION
(
  TID INT NOT NULL,
  Tdate DATE NOT NULL,
  CustomerID INTEGER NOT NULL,
  PRIMARY KEY (TID),
  FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID)
);

CREATE TABLE SOLDVIA
(
  ProductID INT NOT NULL,
  TID INT NOT NULL,
  PRIMARY KEY (ProductID, TID),
  FOREIGN KEY (ProductID) REFERENCES PRODUCT(ProductID),
  FOREIGN KEY (TID) REFERENCES SALESTRANSACTION(TID)
);`

const styles = (theme) => ({
  section: {
    height: "100%",
    display: "flex",
    flexFlow: "column",
  },
  contentArea: {
    height: "100%",
  },
  grid: {
    padding: theme.spacing(3),
    textAlign: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  descriptionGridItem: {},
  descriptionPaper: {
    textAlign: "left",
    padding: 20,
    height: 440,
  },
  textbookImage: {
    width: 200,
    textAlign: "center",
    margin: 20,
    border: "1px solid #aaa",
  },
  partnerLoyolaImage: {
    width: 175,
  },
  parnterAptitiveImage: {
    width: 175,
    border: "1px solid #ddd",
  },
  sqlBlock: {
    textAlign: "left",
  },
  textAlignLeft: {
    textAlign: "left",
  },
  footerGrid: {
    backgroundColor: "#eeeeee",
    textAlign: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  version: {
    textAlign: "center",
  },
  upgrade: {
    border: "5px solid #ff3333",
  },
})

class HomePage extends Component {
  componentDidMount() {
    ReactGA.pageview("/")
  }

  render() {
    const { classes } = this.props

    return (
      <section className={classes.section}>
        <Header />

        <Grid container className={classes.grid} spacing={3}>
          {/* HEADING */}

          {/* <Grid item xs={12}>
            <Typography variant="h6" className={classes.upgrade}>
              Site Upgrade In Progress : All Features Disabled Until Upgrade Complete
            </Typography>
          </Grid> */}

          <Grid item xs={3} />

          <Grid item xs={6} style={{ textAlign: "center" }}>
            <img alt="ERDPlus logo" src="erdplus_logo_large.png" />
          </Grid>

          <Grid item xs={3} style={{ verticalAlign: "bottom" }}>
            <Typography variant="h6" style={{ marginTop: 80 }}>
              Partners
            </Typography>
            <p>
              <a href="https://www.luc.edu/quinlan/certificates/business-data-analytics/">
                <img
                  alt="Loyola University Chicago - Business Data Analytics Certificate"
                  src="Logo1Loyola.png"
                  className={classes.partnerLoyolaImage}
                />
              </a>
            </p>
            <p>
              <a href="https://aptitive.com/">
                <img alt="Aptitive" src="Logo2Aptitive.gif" className={classes.parnterAptitiveImage} />
              </a>
            </p>
          </Grid>

          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="h5">
              A database modeling tool for creating Entity Relationship Diagrams, Relational Schemas, Star Schemas, and
              SQL DDL statements.
            </Typography>
          </Grid>

          {/* INTRODUCTION SECTION */}

          <Grid item xs={4} className={classes.descriptionGridItem}>
            <Paper className={classes.descriptionPaper} elevation={2}>
              <Typography variant="h6">Database Modeling</Typography>
              <Typography variant="body1">
                ERDPlus is a web-based database modeling tool that lets you quickly and easily create
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1">Entity Relationship Diagrams (ERDs)</Typography>
                </li>
                <li>
                  <Typography variant="body1">Relational Schemas (Relational Diagrams)</Typography>
                </li>
                <li>
                  <Typography variant="body1">Star Schemas (Dimensional Models)</Typography>
                </li>
              </ul>
              <Typography variant="body1">More features</Typography>
              <ul>
                <li>
                  <Typography variant="body1">Automatically convert ER Diagrams into Relational Schemas</Typography>
                </li>
                <li>
                  <Typography variant="body1">Export SQL</Typography>
                </li>
                <li>
                  <Typography variant="body1">Export diagrams as a PNG</Typography>
                </li>
                <li>
                  <Typography variant="body1">Save diagrams safely on our server</Typography>
                </li>
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={4} className={classes.descriptionGridItem}>
            <Paper className={classes.descriptionPaper} elevation={2}>
              <Typography variant="h6">SQL DDL Statements</Typography>
              <Typography variant="body1">Export standard SQL</Typography>
              <ul>
                <li>
                  <Typography variant="body1">Generate SQL from Relational Schemas and Star Schemas</Typography>
                </li>
                <li>
                  <Typography variant="body1">Select from common data types and data sizes</Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Works with most contemporary RDBMS tools including Oracle, MySQL, Microsoft SQL Server, PostgresSQL,
                    Teradata, IBM DB2, Microsoft Access, and others.
                  </Typography>
                </li>
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.descriptionPaper} elevation={2}>
              <Typography variant="h6">Textbook</Typography>
              <Typography variant="body1">The Edition 2.0 of the textbook using ERDPlus is now available.</Typography>
              <a href="https://www.prospectpressvt.com/textbooks/jukic-database-systems-introduction-to-databases-and-data-warehouses-2-0?hsLang=en">
                <img alt="Book cover" src="dbtextbook_cover_2nd.webp" className={classes.textbookImage} />
              </a>
            </Paper>
          </Grid>

          {/* ERDs */}

          <Grid item xs={12}>
            <Paper elevation={2}>
              <Grid container className={classes.grid} spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h3">Entity Relationship Diagrams (ERDs)</Typography>
                </Grid>
                <Grid item xs={12}>
                  <img alt="Sample diagram" src="ERDSample.png" />
                </Grid>
                <Grid item xs={4} className={classes.textAlignLeft}>
                  <Typography variant="h6">ERDPlus enables drawing standard ERD components.</Typography>
                  <ul>
                    <li>
                      <Typography variant="body1">Entities</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">Attributes</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">Relationships</Typography>
                    </li>
                  </ul>
                  <Typography variant="body1">
                    The notation supports drawing regular and weak entities, various types of attributes (regular,
                    unique, multi-valued, derived, composite, and optional), and all possible cardinality constraints of
                    relationships (mandatory-many, optional-many, mandatory-one and optional-one).
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <img alt="Animation showing creating an ER diagram" src="ERDAnimation.gif" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* RELATIONAL SCHEMAS */}

          <Grid item xs={12}>
            <Paper elevation={2}>
              <Grid container className={classes.grid} spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h3">Relational Schemas</Typography>
                </Grid>
                <Grid item xs={4} className={classes.textAlignLeft}>
                  <Typography variant="h6">ERDPlus enables drawing standard Relational Schema components</Typography>
                  <ul>
                    <li>
                      <Typography variant="body1">Tables (Relations)</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">Table Columns (including Primary and Foreign Keys)</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">
                        Referential Integrity Constraint Lines (pointing from a Foreign Key to the Primary Key it refers
                        to)
                      </Typography>
                    </li>
                  </ul>
                  <Typography variant="body1">
                    The tool supports quick creation of foreign keys and referential integrity lines by simple
                    click-point-connect actions. This simplifies and quickens the process of creating relational
                    schemas.
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <img alt="Short animation creating a relational schema" src="RelationalSchemaAnimation.gif" />
                </Grid>
                <Grid item xs={12}>
                  <img alt="Sample relational schema diagram" src="RelationalSchemaSample.png" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* CONVERT ER TO RELATIONAL */}

          <Grid item xs={12}>
            <Paper elevation={2}>
              <Grid container className={classes.grid} spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h3">Automatically Convert ER Diagrams to Relational Schemas</Typography>
                </Grid>
                <Grid item xs={4} className={classes.textAlignLeft}>
                  <Typography variant="h6">Convert ER Diagrams</Typography>
                  <Typography variant="body1">
                    ERDPlus enables automatic conversion of ER Diagrams to Relational Schemas with one click of a
                    button. This vastly speeds up the process of creating a Relational Schema based on an ER Diagram.
                  </Typography>
                  <Typography variant="h6">To use this feature</Typography>
                  <ol>
                    <li>
                      <Typography variant="body1">Log into your account.</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">
                        Click on the drop menu next to the name of any ER Diagram and chose “Convert to Relational
                        Schema” option.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1">
                        This will create a diagram containing the converted Relational Schema.
                      </Typography>
                    </li>
                  </ol>
                  <Typography variant="body1" />
                </Grid>
                <Grid item xs={8}>
                  <img alt="Short animation creating a relational schema" src="RelationalSchemaAnimation.gif" />
                </Grid>
                <Grid item xs={12}>
                  <img alt="An ER diagram that can be converted into a relational schema" src="ERDSample.png" />
                </Grid>
                <Grid item xs={12}>
                  <img
                    alt="Sample relational schema automatically created from the ER diagram"
                    src="RelationalSchemaSample.png"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* STAR SCHEMAS */}

          <Grid item xs={12}>
            <Paper elevation={2}>
              <Grid container className={classes.grid} spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h3">Star Schemas</Typography>
                </Grid>
                <Grid item xs={4} className={classes.textAlignLeft}>
                  <Typography variant="h6">ERDPlus enables drawing Star Schema components.</Typography>
                  <ul>
                    <li>
                      <Typography variant="body1">Fact Tables (Facts)</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">Dimension Tables (Dimensions)</Typography>
                    </li>
                  </ul>
                  <Typography variant="body1">
                    The notation distinguishes fact tables from dimension tables by using a thicker frame around fact
                    tables. This makes star schema diagrams easier to interpret. As with relational schemas, the tool
                    supports quick creation of foreign keys and referential integrity lines by simple
                    click-point-connect actions. This simplifies and quickens the process of creating star schemas.
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <img alt="Short animation creating a star schema" src="StarSchemaAnimation.gif" />
                </Grid>
                <Grid item xs={12}>
                  <img alt="An example star schema" src="StarSchemaSample.png" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* CONVERT TO SQL */}

          <Grid item xs={12}>
            <Paper elevation={2}>
              <Grid container className={classes.grid} spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h3">Export SQL</Typography>
                </Grid>
                <Grid item xs={6}>
                  <img
                    alt="An example relational schema that can be converted to SQL"
                    src="RelationalSchemaForSql.png"
                  />
                </Grid>
                <Grid item xs={6}>
                  <pre className={classes.sqlBlock}>{sql}</pre>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={4}>
            Copyright © ERDPlus 2015-2021
          </Grid>
          <Grid item xs={4}>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </Grid>
          <Grid item xs={4}>
            <Link to="mailto:info@erdplus.com">info@erdplus.com</Link>
          </Grid>
          <Grid item xs={4} className={classes.version}>
            <Typography variant="caption">
              {stage} / {date} / {checksum}
            </Typography>
          </Grid>
        </Grid>
      </section>
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
  )(HomePage)
)
