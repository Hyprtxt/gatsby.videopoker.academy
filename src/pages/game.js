import React from "react"
// import { Link } from "gatsby"
// import Layout from "src/components/layout"
import SEO from "src/components/seo"
import pokerMachine from "src/machines/poker"
import { useMachine } from "@xstate/react"

const Card = ({ index, state, handleClick, children }) => {
  // console.log(children[0], children[1])
  const held = state.context.holds[index]
  return (
    <div className={`card-unit key-${index} ${held ? "hold" : ""}`}>
      <div className="card" onClick={handleClick}>
        <span className={`value`}>{children[1]}</span>
        <span className={`suit suit-${children[0]}`}>{children[0]}</span>
      </div>
      {state.value !== "score" && (
        <button className="btn btn-info" onClick={handleClick}>
          {held ? "Held" : "Hold"}
        </button>
      )}
    </div>
  )
}

const GamePage = () => {
  const [state, send] = useMachine(pokerMachine)
  const mapCards = (item, index) => {
    return (
      <Card
        key={index}
        index={index}
        state={state}
        handleClick={e => {
          e.preventDefault()
          send(`HOLD_TOGGLE_${index + 1}`)
        }}
      >
        {item}
      </Card>
    )
  }
  return (
    <>
      <SEO title="Video Poker" />
      {state.value === "active" && state.context.hand.map(mapCards)}
      {state.value === "score" && state.context.final_cards.map(mapCards)}
      {state.value === "score" && [
        <div className="clearfix" />,
        <pre>{JSON.stringify(state.context.result, null, 2)}</pre>,
      ]}
      {/* <div className="clearfix"></div> */}
      {(state.value === "idle" || state.value === "score") && (
        <button
          className="btn btn-primary"
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
          className="btn btn-primary"
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
    </>
  )
}
export default GamePage
