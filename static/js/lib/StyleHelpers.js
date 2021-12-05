import React from "react"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"

// https://material-ui.com/customization/css-in-js/#alternative-apis

// Taken from https://material-ui.com/customization/css-in-js/#render-props-api-11-lines-

export function createStyled(styles, options) {
  function Styled(props) {
    const { children, ...other } = props
    return props.children(other)
  }
  // Styled.propTypes = {
  //   children: PropTypes.func.isRequired,
  //   classes: PropTypes.object.isRequired,
  // };
  return withStyles(styles, options)(Styled)
}

// Taken from https://material-ui.com/customization/css-in-js/#styled-components-api-15-lines-

export function styled(Component) {
  return (style, options) => {
    function StyledComponent(props) {
      const { classes, className, ...other } = props
      return <Component className={classNames(classes.root, className)} {...other} />
    }
    // StyledComponent.propTypes = {
    //   classes: PropTypes.object.isRequired,
    //   className: PropTypes.string,
    // };
    const styles = typeof style === "function" ? theme => ({ root: style(theme) }) : { root: style }
    return withStyles(styles, options)(StyledComponent)
  }
}
