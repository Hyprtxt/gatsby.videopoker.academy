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

const MachineButton = ({ gameState, gameSend, eventSlug, activeOn }) => (
  <>
    {activeOn.indexOf(gameState.value) !== -1 && (
      <button
        className="btn btn-primary"
        onClick={e => {
          e.preventDefault()
          gameSend(eventSlug)
        }}
      >
        {eventSlug}
      </button>
    )}
  </>
)

const PokerUI = ({ gameState, gameSend, children }) => {
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
      {gameState.context.mode !== "trainer" ? (
        gameState.value !== "idle" ? (
          gameState.context.credits !== "?" ? (
            <p>{`Credits: ${gameState.context.credits}`}</p>
          ) : null
        ) : null
      ) : null}
      {["active", "loadingResults", "score"].indexOf(gameState.value) !==
        -1 && (
        <div>
          {gameState.context[eventContext[gameState.value]].map(mapCards)}
          <div className="clearfix" />
        </div>
      )}
      {gameState.value === "score" && (
        <pre>{JSON.stringify(gameState.context.result, null, 2)}</pre>
      )}
      <MachineButton
        {...{
          gameState,
          gameSend,
          eventSlug: "START",
          activeOn: ["idle", "score"],
        }}
      />
      {children}
      {gameState.context.mode === "trainer" ? (
        <MachineButton
          {...{
            gameState,
            gameSend,
            eventSlug: "SUGGEST",
            activeOn: ["active"],
          }}
        />
      ) : null}
      <MachineButton
        {...{ gameState, gameSend, eventSlug: "SCORE", activeOn: ["active"] }}
      />
    </>
  )
}

export default PokerUI