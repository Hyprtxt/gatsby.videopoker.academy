import React from "react"

const Card = ({ index, state, handleClick, children }) => {
  // console.log(children[0], children[1])
  const held = state.context.holds[index]
  return (
    <div className={`card-unit key-${index} ${held ? "hold" : ""}`}>
      <div
        className="card"
        onClick={handleClick}
        role="button"
        tabIndex={index}
      >
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

const PokerUI = ({ gameState, gameSend }) => {
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
      {gameState.value === "active" && (
        <div>{gameState.context.hand.map(mapCards)}</div>
      )}
      {gameState.value === "score" && (
        <div>{gameState.context.final_cards.map(mapCards)}</div>
      )}
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
    </>
  )
}

export default PokerUI
