const React = require("react")
const Layout = require("./src/components/layout").default
const { useMachine } = require("@xstate/react")
const { Machine } = require("xstate")
/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

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

const toggleMachine = Machine({
  id: "toggle",
  initial: "inactive",
  states: {
    inactive: {
      on: { TOGGLE: "active" },
    },
    active: {
      on: { TOGGLE: "inactive" },
    },
  },
})

const Toggler = () => {
  const [state, send] = useMachine(toggleMachine)

  return (
    <button onClick={() => send("TOGGLE")}>
      {state.value === "inactive"
        ? "Click to activate"
        : "Active! Click to deactivate"}
    </button>
  )
}

exports.wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <Layout {...props}>
      {element}
      <Toggler />
    </Layout>
  )
}
