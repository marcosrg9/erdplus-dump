import { createSelector } from "reselect"

const getRoutePathname = (state, props) => {
  return props.history.location.pathname
}

export const getResetPasswordToken = createSelector(
  [getRoutePathname],
  pathname => {
    const parts = pathname.split("/")
    if (parts.length === 3 && parts[1] === "reset-password") {
      const token = parts[2]
      return token
    } else {
      return null
    }
  }
)
