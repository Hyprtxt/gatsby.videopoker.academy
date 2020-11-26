import React, { useContext } from "react"
// import { Link } from "gatsby"
// import Layout from "src/components/layout"
import SEO from "src/components/seo"
import pokerMachineFactory from "src/machines/poker"
import { useMachine } from "@xstate/react"
import ReactXStateContext from "src/ReactXStateContext"

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
  const sessionMacine = useContext(ReactXStateContext)
  const { state, send } = sessionMacine
  // console.log("sessionMacine", state.context.user.id)
  const [gameState, gameSend] = useMachine(
    pokerMachineFactory(state.context.user.id)
  )
  const mapCards = (item, index) => {
    return (
      <Card
        key={index}
        index={index}
        state={gameState}
        handleClick={e => {
          e.preventDefault()
          gameSend(`HOLD_TOGGLE_${index + 1}`)
        }}
      >
        {item}
      </Card>
    )
  }

  return (
    <>
      <SEO title="Video Poker" />
      {gameState.value === "active" && gameState.context.hand.map(mapCards)}
      {gameState.value === "score" &&
        gameState.context.final_cards.map(mapCards)}
      {gameState.value === "score" && [
        <div className="clearfix" />,
        <pre>{JSON.stringify(gameState.context.result, null, 2)}</pre>,
      ]}
      {/* <div className="clearfix"></div> */}
      {(gameState.value === "idle" || gameState.value === "score") && (
        <button
          className="btn btn-primary"
          onClick={e => {
            e.preventDefault()
            gameSend("START")
          }}
        >
          START
        </button>
      )}
      {gameState.value === "active" && (
        <button
          className="btn btn-primary"
          onClick={e => {
            e.preventDefault()
            gameSend("SCORE")
          }}
        >
          SCORE
        </button>
      )}
      <h3>{gameState.value}</h3>
      <pre>{JSON.stringify(gameState.context, null, 2)}</pre>
    </>
  )
}
export default GamePage
