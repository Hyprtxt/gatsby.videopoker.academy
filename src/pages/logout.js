import React, { useContext } from "react"
import { store } from "src/store"
import SEO from "src/components/seo"
import { navigate } from "gatsby"

const Logout = () => {
  const sessionMachine = useContext(store)
  const { state, send } = sessionMachine
  window.localStorage.clear()
  console.log("sending LOGOUT", state.value)
  send("LOGOUT")
  setTimeout(() => {
    navigate("/")
  }, 1500)
  return (
    <>
      <SEO title="Logout" />
      <h1>Goodbye!</h1>
      <p>See you next time.</p>
    </>
  )
}

export default Logout
