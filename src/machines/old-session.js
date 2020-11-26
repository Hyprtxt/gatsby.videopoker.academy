import { Machine, assign } from "xstate"
const GATSBY_API_URL = process.env.GATSBY_API_URL || "http://localhost:1337"

const loginGoogle = loginURL => {
  console.log("DO THINGS")
  return fetch(loginURL)
    .then(res => {
      console.log(res.status, "RESPONSE")
      if (res.status !== 200) {
        throw new Error(`Couldn't login to Strapi API. Status: ${res.status}`)
      }
      return res
    })
    .then(response => response.json())
}
const createSessionMachine = loginURL => {
  const sessionMachine = Machine({
    id: "session",
    initial: "inactive",
    context: {
      loginURL: loginURL,
      user: {},
      jwt: null,
    },
    states: {
      // load from localStorage?
      idle: {
        on: { LOGIN: "tryLogin" },
      },
      inactive: {
        always: "tryLogin",
      },
      tryLogin: {
        invoke: {
          id: "loginGoogle",
          src: (context, event) => loginGoogle(context.loginURL),
          onDone: {
            target: "active",
            actions: assign({
              user: (context, event) => event.data.user,
              jwt: (context, event) => event.data.jwt,
            }),
          },
          onError: {
            target: "failure",
            actions: (context, event) => {
              console.log("BIG FAIL", context, event)
            },
          },
        },
      },
      active: {
        on: { LOGOUT: "doLogout" },
      },
      doLogout: {
        target: "idle",
        actions: assign({
          user: null,
          jwt: null,
        }),
      },
      failure: {},
    },
  })
  return sessionMachine
}

export default createSessionMachine
