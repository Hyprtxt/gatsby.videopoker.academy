const React = require("react")
const Layout = require("src/components/layout").default
const { XStateProvider } = require("src/store")

/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

require("src/style/layout.sass")

// You can delete this file if you're not using it
exports.onPreRouteUpdate = ({ location, prevLocation }) => {
  console.log("Gatsby started to change location to", location.pathname)
  console.log(
    "Gatsby started to change location from",
    prevLocation ? prevLocation.pathname : null
  )
}

exports.onClientEntry = () => {
  console.log("We've started!")
}

exports.wrapRootElement = ({ element }) => {
  return <XStateProvider>{element}</XStateProvider>
}

exports.wrapPageElement = ({ element, props }) => {
  // console.log("window", token, user)
  // const [state, send] = useMachine()
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <>
      <Layout {...props}>{element}</Layout>
    </>
  )
}
