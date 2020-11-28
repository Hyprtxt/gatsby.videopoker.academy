import React, { useEffect } from "react"

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
        <span className={`info d-none-md`}>
          {children[1]}
          <span className={`suit-${children[0]}`}>{children[0]}</span>
        </span>
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
  const eventContext = {
    active: "hand",
    score: "final_cards",
    loadingResults: "hand",
  }
  useEffect(() => {
    const handleKeyboardEvent = event => {
      // console.log(event.key, event.type)
      switch (event.key) {
        case "1":
          return gameSend("HOLD_TOGGLE_1")
        case "2":
          return gameSend("HOLD_TOGGLE_2")
        case "3":
          return gameSend("HOLD_TOGGLE_3")
        case "4":
          return gameSend("HOLD_TOGGLE_4")
        case "5":
          return gameSend("HOLD_TOGGLE_5")
        case "Enter":
          return gameState.value === "active"
            ? gameSend("SCORE")
            : gameSend("START")
        default:
          break
      }
    }
    document.addEventListener("keydown", handleKeyboardEvent)
    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent)
    }
  })
  return (
    <>
      {gameState.value !== "idle" ? (
        gameState.context.credits !== "?" ? (
          <p>{`Credits: ${gameState.context.credits}`}</p>
        ) : null
      ) : null}
      {(gameState.value === "active" ||
        gameState.value === "loadingResults" ||
        gameState.value === "score") && (
        <div>
          {gameState.context[eventContext[gameState.value]].map(mapCards)}
          <div className="clearfix" />
        </div>
      )}
      {gameState.value === "score" && (
        <pre>{JSON.stringify(gameState.context.result, null, 2)}</pre>
      )}
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
