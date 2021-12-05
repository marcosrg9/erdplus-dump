import React from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import ConvertActions from "../redux/Convert"
import Grid from "@material-ui/core/Grid"
import { CopyToClipboard } from "react-copy-to-clipboard"

const styles = theme => ({
  dialog: {},
  sql: {
    width: 500,
    height: 300
  }
})

class ConvertToSqlDialog extends React.Component{
  handleCancel = () => {
    this.props.hideConvertSqlDialog()
  }

  handleCopy = () => {
    this.props.setSqlCopied()
  }

  render() {
    const { showConvertSqlDialog, sql, sqlCopied, classes } = this.props

    const title = sqlCopied ? "Generate SQL - Copied" : "Generate SQL"

    return (
      <Dialog
        open={showConvertSqlDialog}
        aria-labelledby="convert-diagram-dialog"
        onEscapeKeyDown={this.handleCancel}
        className={classes.dialog}>
        <DialogTitle id="convert-diagram-dialog">{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <pre align="left" variant="body2">
                {sql}
              </pre>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Close (ESC)
          </Button>
          <CopyToClipboard text={sql} onCopy={this.handleCopy}>
            <Button color="primary">Copy</Button>
          </CopyToClipboard>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => {
  const diagramId = state.convert.diagramId
  const diagram = state.diagram.diagrams.find(d => d.id === diagramId)
  return {
    diagram,
    sql: state.convert.sql,
    showConvertSqlDialog: state.convert.showConvertSqlDialog,
    sqlCopied: state.convert.sqlCopied
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideConvertSqlDialog: () => dispatch(ConvertActions.hideConvertSqlDialog()),
    setSqlCopied: () => dispatch(ConvertActions.setSqlCopied())
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog()(ConvertToSqlDialog))
)
