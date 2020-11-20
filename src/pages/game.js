import React from "react"
// import { Link } from "gatsby"
import Layout from "src/components/layout"
import SEO from "src/components/seo"
import pokerMachine from "src/machines/poker"
import { useMachine } from "@xstate/react"

// const Card = ({ item, index, send, buttonText }) => {
//   return (

//   )
// }

const GamePage = () => {
  const [state, send] = useMachine(pokerMachine)
  const mapCards = (item, index) => {
    const held = state.context.holds[index]
    return (
      <div
        className={`card-unit key${index} ${held ? "hold" : ""}`}
        key={index}
      >
        <div
          className="card"
          onClick={e => {
            e.preventDefault()
            send(`HOLD_TOGGLE_${index + 1}`)
          }}
        >
          {item}
        </div>
        {state.value !== "score" && (
          <button
            onClick={e => {
              e.preventDefault()
              send(`HOLD_TOGGLE_${index + 1}`)
            }}
          >
            {held ? "Held" : "Hold"}
          </button>
        )}
      </div>
    )
  }
  return (
    <Layout>
      <SEO title="Video Poker" />
      {state.value === "active" && state.context.hand.map(mapCards)}
      {state.value === "score" && state.context.final_cards.map(mapCards)}
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
      {/* <pre>{JSON.stringify(state.context, null, 2)}</pre> */}
    </Layout>
  )
}
export default GamePage
