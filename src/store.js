// store.js
import React, { createContext } from "react"
import sessionMachineFactory from "src/machines/session"
import { useMachine } from "@xstate/react"

const initialState = {}
const store = createContext(initialState)
const { Provider } = store

const XStateProvider = ({ children }) => {
  const storage = {
    token: window.localStorage.getItem("token"),
    user: JSON.parse(window.localStorage.getItem("user")),
    loginURL: window.localStorage.getItem("loginURL"),
  }
  const [state, send] = useMachine(
    sessionMachineFactory(storage.loginURL, storage.token, storage.user)
  )
  // if (storage.token) {
  //   console.log("We are logged in")
  //   token = storage.token
  //   user = storage.user
  // } else {
  //   console.log("We are NOT logged in")
  //   if (storage.loginURL) {
  //     console.log("Gonna Try to LOGIN")
  //     send({ type: "LOGIN", loginURL: storage.loginURL })
  //   }
  // }
  return <Provider value={{ state, send }}>{children}</Provider>
}

export { store, XStateProvider }
