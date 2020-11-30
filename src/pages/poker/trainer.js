import React, { useContext, useState, useEffect } from "react"
import { store } from "src/store"
import SEO from "src/components/seo"
import pokerMachineFactory from "src/machines/poker"
import { useMachine } from "@xstate/react"
import PokerUI from "src/components/poker-ui"
import useIsClient from "src/hooks/use-is-client"

const Game = () => {
  const sessionMachine = useContext(store)
  const { state, send } = sessionMachine
  const { token } = state.context
  const [gameState, gameSend] = useMachine(
    pokerMachineFactory(token, "trainer")
  )
  const [isGameOver, setGameOver] = useState(false)
  const [streak, setStreak] = useState(0)
  useEffect(() => {
    if (gameState.value === "score") {
      const playerMove = gameState.context.holds
        .map((isHold, index) => (isHold ? `HOLD_${index + 1}` : null))
        .filter(x => x)
      const correctMove = gameState.context.strategy.strategy
      const results = {
        playerMove,
        correctMove,
        win:
          JSON.stringify(playerMove) === JSON.stringify(correctMove)
            ? true
            : false,
      }
      console.log(results)
      if (results.win) {
        setStreak(streak + 1)
      } else {
        setGameOver(true)
      }
    }
  }, [gameState.value])
  return (
    <>
      <SEO title="Video Poker Trainer" />
      {!isGameOver ? (
        <PokerUI {...{ gameState, gameSend, token }} />
      ) : (
        <h3>{`Game over man!`}</h3>
      )}
      <h3>{`state: ${gameState.value}`}</h3>
      <h3>{`streak: ${streak}`}</h3>
      <pre>{JSON.stringify(gameState.context, null, 2)}</pre>
    </>
  )
}

const GamePage = () => {
  const { isClient, key } = useIsClient()
  if (!isClient) return null
  return <Game />
}
export default GamePage
