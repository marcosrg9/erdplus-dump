import React, { Component } from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Header from "./Header"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
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
  }
})

class PrivacyPolicyPage extends Component {
  componentDidMount() {
    ReactGA.pageview("/privacy-policy")
  }

  render() {
    const { classes } = this.props

    return (
      <section className={classes.section}>
        <Header />
        <Grid container spacing={1}>
          <Grid item md={3} />
          <Grid item xs={12} md={6} className={classes.words}>
            <Typography variant="h3" className={classes.title}>
              Privacy Policy
            </Typography>
            <Typography variant="body1">
              This privacy policy discloses the privacy practices for https://erdplus.com. This privacy policy applies
              solely to information collected by this web site. It will notify you of the following:
            </Typography>
            <ol>
              <li>
                <Typography variant="body1">
                  What personally identifiable information is collected from you through the web site, how it is used
                  and with whom it may be shared.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  What choices are available to you regarding the use of your data.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  The security procedures in place to protect the misuse of your information.
                </Typography>
              </li>
            </ol>

            <Typography variant="h6">Information Collection, Use, and Sharing</Typography>
            <Typography variant="body1">
              We are the sole owners of the information collected on this site. We only have access to/collect
              information that you voluntarily give us via email or other direct contact from you. We will not sell or
              rent this information to anyone. We will use your information to respond to you, regarding the reason you
              contacted us. We will not share your information with any third party outside of our organization.
            </Typography>

            <Typography variant="h6">Your Access to and Control Over Information</Typography>
            <Typography variant="body1">
              You can do the following at any time by contacting us via the email address on our website:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">See what data we have about you, if any.</Typography>
              </li>
              <li>
                <Typography variant="body1">Change/correct any data we have about you.</Typography>
              </li>
              <li>
                <Typography variant="body1">Have us delete any data we have about you.</Typography>
              </li>
              <li>
                <Typography variant="body1">Express any concern you have about our use of your data.</Typography>
              </li>
            </ul>

            <Typography variant="h6">Security</Typography>
            <Typography variant="body1">
              We take precautions to protect your information. When you submit sensitive information via the website,
              your information is protected both online and offline.
            </Typography>
            <Typography variant="body1">
              Wherever we collect sensitive information (such as passwords), that information is encrypted and
              transmitted to us in a secure way. You can verify this by looking for a closed lock icon at the bottom of
              your web browser, or looking for "https" at the beginning of the address of the web page.
            </Typography>
            <Typography variant="body1">
              While we use encryption to protect sensitive information transmitted online, we also protect your
              information offline. Only employees who need the information to perform a specific job are granted access
              to personally identifiable information. The computers/servers in which we store personally identifiable
              information are kept in a secure environment.
            </Typography>

            <Typography variant="h6">Registration</Typography>
            <Typography variant="body1">
              In order to use this website, a user may first optionally complete the registration form. Registration is
              required to use some features of the site. During registration a user is required to give certain
              information (such as name and email address). This information is used to contact you about the
              products/services on our site in which you have expressed interest.
            </Typography>

            <Typography variant="h6">Cookies</Typography>
            <Typography variant="body1">
              We use "cookies" on this site. A cookie is a piece of data stored on a site visitor's hard drive to help
              us improve your access to our site and identify repeat visitors to our site. For instance, when we use a
              cookie to identify you, you would not have to log in a password more than once, thereby saving time while
              on our site. Cookies can also enable us to track and target the interests of our users to enhance the
              experience on our site. Usage of a cookie is in no way linked to any personally identifiable information
              on our site.
            </Typography>

            <Typography variant="h6">Updates</Typography>
            <Typography variant="body1">
              Our Privacy Policy may change from time to time and all updates will be posted on this page.
            </Typography>
            <Typography variant="body1">
              If you feel that we are not abiding by this privacy policy, you should contact us immediately via email to
              info@erdplus.com.
            </Typography>
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
  )(PrivacyPolicyPage)
)
