import React, { useEffect } from "react"
import PreloadCredits from "src/components/poker-ui/credits"
import Card from "src/components/poker-ui/card"
import MachineButton from "src/components/poker-ui/machine-button"

const TrainerPokerUI = ({ gameState, gameSend, token, children }) => {
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
  const mapResultCards = (item, index) => {
    return (
      <Card
        key={index}
        index={index}
        state={gameState}
        holdDataSource={["1", "2", "3", "4", "5"].map(slot =>
          gameState.context.strategy.strategy.indexOf(`HOLD_${slot}`) > -1
            ? true
            : false
        )}
      >
        {item}
      </Card>
    )
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
            ? gameSend("CHECK")
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
  const eventContext = {
    active: "hand",
    result: "final_cards",
    loadingResults: "hand",
  }
  return (
    <>
      {["active", "loadingResults", "result"].indexOf(gameState.value) !==
        -1 && (
        <div>
          {gameState.context[eventContext[gameState.value]].map(mapCards)}
          <div className="clearfix" />
        </div>
      )}
      {gameState.value === "gameOver" && [
        <h3>Your Move:</h3>,
        gameState.context["hand"].map(mapCards),
        <h3>Correct Move:</h3>,
        gameState.context["hand"].map(mapResultCards),
        <h3>{`Wrong! Rule #${gameState.context.strategy.rule_number}: ${gameState.context.strategy.rule}`}</h3>,
      ]}
      {/* {gameState.value === "result" && children} */}
      <MachineButton
        {...{
          gameState,
          gameSend,
          eventSlug: "START",
          activeOn: ["idle", "result"],
        }}
      />
      <MachineButton
        {...{ gameState, gameSend, eventSlug: "CHECK", activeOn: ["active"] }}
      />
      {gameState.value === "result" && (
        <h3>{`Correct! Rule #${gameState.context.strategy.rule_number}: ${gameState.context.strategy.rule}`}</h3>
      )}
    </>
  )
}

export default TrainerPokerUI
