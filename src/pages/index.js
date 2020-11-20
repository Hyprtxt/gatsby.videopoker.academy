import React from "react"
import { Link } from "gatsby"

import Layout from "src/components/layout"
// import Image from "src/components/image"
import SEO from "src/components/seo"

import { useMachine } from "@xstate/react"
import { Machine } from "xstate"

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

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>This is a website.</p>
    <Link to="/game">Play the game</Link>
    <Toggler />
  </Layout>
)

export default IndexPage
