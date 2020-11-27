import React, { useContext } from "react"
import { store } from "src/store"
import { useLocation } from "@reach/router"
import { navigate } from "gatsby"
import useIsClient from "src/hooks/use-is-client"

const GATSBY_API_URL = process.env.GATSBY_API_URL || "http://localhost:1337"

const Redirect = ({ providerName }) => {
  const { isClient, key } = useIsClient()
  const sessionMachine = useContext(store)
  const { state, send } = sessionMachine
  const location = useLocation()
  const loginURL = `${GATSBY_API_URL}/auth/${providerName}/callback${location.search}`
  if (!isClient) return null
  // console.log("sending login event", loginURL)
  send({ type: "LOGIN", loginURL: loginURL })
  if (state.value === "active") {
    setTimeout(() => {
      navigate("/")
    }, 500)
  }
  return (
    <div className="p-5">
      {state.value !== "active" && <p>Loading...</p>}
      {state.value === "active" && <p>Redirecting...</p>}
    </div>
  )
}

export default Redirect
