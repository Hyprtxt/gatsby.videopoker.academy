import React, { useEffect } from "react"
import PreloadCredits from "src/components/poker-ui/credits"
import Card from "src/components/poker-ui/card"
import MachineButton from "src/components/poker-ui/machine-button"

const PokerUI = ({ gameState, gameSend, token, children }) => {
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
        <PreloadCredits {...{ gameState, token }} />
      ) : null}
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
      {gameState.context.mode === "casual" ? (
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
