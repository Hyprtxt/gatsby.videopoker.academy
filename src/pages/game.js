import React from "react"
// import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import pokerMachine from "../machines/poker"
import { useMachine } from "@xstate/react"

const Card = ({ children }) => <div>{children}</div>

const GamePage = () => {
  const [state, send] = useMachine(pokerMachine)
  return (
    <Layout>
      <SEO title="Video Poker" />
      <p>Something</p>
      {state.value === "active" &&
        state.context.hand.map((item, index) => (
          <>
            <Card key={index}>{item}</Card>
            <button
              onClick={e => {
                e.preventDefault()
                send(`HOLD_TOGGLE_${index + 1}`)
              }}
            >
              Hold
            </button>
          </>
        ))}
      <h3>{state.value}</h3>
      <pre>{JSON.stringify(state.context, null, 2)}</pre>
      {state.value === "idle" && (
        <button
          onClick={e => {
            e.preventDefault()
            send("START")
          }}
        >
          START
        </button>
      )}
      {state.value === "active" && (
        <button
          onClick={e => {
            e.preventDefault()
            send("SCORE")
          }}
        >
          SCORE
        </button>
      )}
    </Layout>
  )
}
export default GamePage
