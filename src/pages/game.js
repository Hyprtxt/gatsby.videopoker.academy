import React from "react"
// import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import pokerMachine from "../machines/poker"
import { useMachine } from "@xstate/react"

// const Card = ({ item, index, send, buttonText }) => {
//   return (

//   )
// }

const GamePage = () => {
  const [state, send] = useMachine(pokerMachine)
  return (
    <Layout>
      <SEO title="Video Poker" />
      <p>Something</p>
      {state.value === "active" &&
        state.context.hand.map((item, index) => (
          <div className="card-unit" key={index}>
            <div
              className="card"
              onClick={e => {
                e.preventDefault()
                send(`HOLD_TOGGLE_${index + 1}`)
              }}
            >
              {item}
            </div>
            <button
              onClick={e => {
                e.preventDefault()
                send(`HOLD_TOGGLE_${index + 1}`)
              }}
            >
              {state.context.holds[index] ? "Held" : "Hold"}
            </button>
          </div>
        ))}
      {state.value === "score" && (
        <pre>{JSON.stringify(state.context.result, null, 2)}</pre>
      )}
      {(state.value === "idle" || state.value === "score") && (
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

      <h3>{state.value}</h3>
      <pre>{JSON.stringify(state.context, null, 2)}</pre>
    </Layout>
  )
}
export default GamePage
