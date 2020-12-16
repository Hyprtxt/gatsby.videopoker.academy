import { Machine, assign } from "xstate"

const GATSBY_API_URL = process.env.GATSBY_API_URL || "http://localhost:1337"

const doFetch = (loginURL, options) => {
  return fetch(loginURL, options)
    .then(res => {
      console.log(res.status, "RESPONSE")
      if (res.status !== 200) {
        throw new Error(
          `Couldn't talk to the Strapi API. Status: ${res.status}`
        )
      }
      return res
    })
    .then(response => response.json())
}

const userProfileMachine = token =>
  Machine(
    {
      id: "userProfileUpdate",
      initial: "loading",
      context: {
        token,
        id: null,
        handle: null,
        credits: null,
        response: null,
        error: null,
      },
      states: {
        loading: {
          invoke: {
            id: "doFetch",
            src: (context, event) =>
              doFetch(`${GATSBY_API_URL}/users/me`, {
                headers: {
                  Authorization: `Bearer ${context.token}`,
                },
              }),
            onDone: {
              target: "active",
              actions: assign({
                response: (context, event) => event.data,
                id: (context, event) => event.data.id,
                provider: (context, event) => event.data.provider,
                handle: (context, event) => event.data.Handle,
                credits: (context, event) => event.data.Credits,
              }),
            },
            onError: {
              target: "error",
              actions: [
                assign({ error: (context, event) => event.data.message }),
                (context, event) => {
                  console.log("BIG FAIL", context, event)
                },
              ],
            },
          },
        },
        active: {
          on: {
            CHANGE: {
              target: "active",
              actions: [
                assign({
                  handle: (context, event) => {
                    return event.value
                  },
                }),
              ],
            },
            SUBMIT: {
              target: "loadingUpdate",
            },
          },
        },
        loadingUpdate: {
          invoke: {
            id: "doPutUser",
            src: (context, event) =>
              doFetch(`${GATSBY_API_URL}/users/${context.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${context.token}`,
                },
                body: JSON.stringify({ Handle: context.handle }),
              }),
            onDone: {
              target: "active",
              actions: assign({
                response: (context, event) => event.data,
                id: (context, event) => event.data.id,
                provider: (context, event) => event.data.provider,
                handle: (context, event) => event.data.Handle,
                credits: (context, event) => event.data.Credits,
              }),
            },
            onError: {
              target: "error",
              actions: [
                assign({ error: (context, event) => event.data.message }),
                (context, event) => {
                  console.log("BIG FAIL", context, event)
                },
              ],
            },
          },
        },
        error: {},
      },
    },
    {
      actions: {},
    }
  )

export default userProfileMachine
