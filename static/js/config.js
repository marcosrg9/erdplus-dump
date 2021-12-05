const dev = {
  apiUrl: "https://sjfw52mrt0.execute-api.us-east-1.amazonaws.com/dev/"
}

const production = {
  apiUrl: "https://delcgtquxh.execute-api.us-east-1.amazonaws.com/prod/"
}

const config = process.env.REACT_APP_STAGE === "production" ? production : dev

export default {
  ...config
}
