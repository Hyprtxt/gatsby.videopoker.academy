const React = require("react")
const Layout = require("./src/components/layout").default
const { useMachine } = require("@xstate/react")
const { Machine, assign } = require("xstate")
const ReactXStateContext = require("./src/ReactXStateContext").default

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

const hasToken = (context, event) => context.token !== null

const createUserSessionMachine = (loginURL, token, user) =>
  Machine(
    {
      id: "userSession",
      initial: "static",
      context: {
        loginURL: loginURL || null,
        user: user || null,
        token: token || null,
        error: null,
      },
      states: {
        static: {
          always: {
            target: "active",
            cond: "hasToken",
          },
        },
        inactive: {
          on: { LOGIN: "tryLogin" },
        },
        tryLogin: {
          invoke: {
            id: "tryOAuthLogin",
            src: () => {},
            onDone: {
              target: "active",
              actions: assign({
                user: (context, event) => event.user,
                token: (context, event) => event.jwt,
              }),
            },
            onError: {
              target: "loginFailure",
            },
          },
        },
        active: {
          on: { LOGOUT: "inactive" },
        },
        loginFailure: {},
      },
    },
    {
      guards: {
        hasToken,
      },
    }
  )

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

// const ReactXStateContext = React.createContext(null)

const SessionContext = ({ children }) => {
  let token, user
  if (window.localStorage.getItem("token")) {
    console.log("We are logged in")
    token = window.localStorage.getItem("token")
    user = JSON.parse(window.localStorage.getItem("user"))
  }
  const [state, send] = useMachine(createUserSessionMachine(null, token, user))
  // console.log("wrapROOT", token, user)
  return (
    <ReactXStateContext.Provider value={state}>
      {children}
    </ReactXStateContext.Provider>
  )
}

exports.wrapRootElement = ({ element }) => {
  return <SessionContext>{element}</SessionContext>
}

exports.wrapPageElement = ({ element, props }) => {
  // console.log("window", token, user)
  // const [state, send] = useMachine()
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <Layout {...props}>
      {element}
      {/* <Toggler /> */}
    </Layout>
  )
}
