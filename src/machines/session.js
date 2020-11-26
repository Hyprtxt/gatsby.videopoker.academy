import { Machine, assign } from "xstate"

const hasToken = (context, event) => {
  console.log("hasToken", context.token, context.user)
  return context.token !== null
}
const hasLoginURL = (context, event) => {
  console.log("hasLoginURL", context.loginURL)
  return context.loginURL !== null
}

const hasUser = (context, event) => context.user !== null

const fetchStrapiLogin = loginURL => {
  return (
    fetch(loginURL)
      .then(res => {
        if (res.status !== 200) {
          throw new Error(`Couldn't login to Strapi API. Status: ${res.status}`)
        }
        return res
      })
      .then(res => res.json())
      // .then(res => {
      //   const payload = res.json()
      //   console.log("GOODSTUFF", res)
      //   localStorage.setItem("user", JSON.stringify(payload.data.user))
      //   localStorage.setItem("token", payload.data.jwt)
      //   localStorage.removeItem("loginURL")
      //   return payload
      // })
      .catch(err => {
        console.log(err)
        // setText("An error occurred, please see the developer console.")
      })
  )
}

const sessionMachineFactory = (loginURL, token, user) =>
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
          always: [
            {
              target: "tryLogin",
              cond: "hasLoginURL",
            },
            {
              target: "active",
              cond: "hasToken",
            },
            { target: "inactive" },
          ],
        },
        inactive: {
          on: {
            LOGIN: {
              target: "tryLogin",
              actions: assign({
                loginURL: (context, event) => event.loginURL,
              }),
            },
          },
          // on: { LOGIN: "tryLogin" },
        },
        tryLogin: {
          invoke: {
            id: "fetchStrapiLogin",
            src: (context, event) => fetchStrapiLogin(context.loginURL),
            onDone: {
              target: "active",
              actions: [
                (context, event) => {
                  localStorage.setItem("user", JSON.stringify(event.data.user))
                  localStorage.setItem("token", event.data.jwt)
                },
                assign({
                  user: (context, event) =>
                    //event.data.user,
                    {
                      console.log("assignTryOAuth", event)
                      return event.data.user
                    },
                  token: (context, event) => event.data.jwt,
                }),
              ],
            },
            onError: {
              target: "loginFailure",
            },
          },
        },
        sessionActive: {
          on: {
            LOGOUT: {
              target: "inactive",
              actions: [],
            },
          },
        },
        active: {
          // Has a token, need to load from localstorage?
          on: {
            LOGOUT: {
              target: "inactive",
              actions: assign({
                loginURL: null,
                user: null,
                token: null,
                error: null,
              }),
            },
          },
        },
        loginFailure: {},
      },
    },
    {
      guards: {
        hasToken,
        hasUser,
        hasLoginURL,
      },
    }
  )

export default sessionMachineFactory
