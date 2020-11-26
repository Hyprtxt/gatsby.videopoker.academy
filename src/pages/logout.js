import React, { useContext } from "react"
import ReactXStateContext from "src/ReactXStateContext"
import { Link } from "gatsby"
import Layout from "src/components/layout"
import SEO from "src/components/seo"

const Logout = () => {
  const sessionMachine = useContext(ReactXStateContext)
  const { state, send } = sessionMachine
  window.localStorage.clear()
  send("LOGOUT")
  return (
    <Layout>
      <SEO title="Logout" />
      <h1>Goodbye!</h1>
      <p>See you next time.</p>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export default Logout
