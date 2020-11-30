import React, { useContext, useState, useEffect } from "react"
import { store } from "src/store"
import SEO from "src/components/seo"
import pokerMachineFactory from "src/machines/poker"
import { useMachine } from "@xstate/react"
import PokerUI from "src/components/poker-ui"
import useIsClient from "src/hooks/use-is-client"
import { Link } from "gatsby"

const Game = () => {
  const sessionMachine = useContext(store)
  const { state } = sessionMachine
  const { token } = state.context
  const [gameState, gameSend] = useMachine(
    pokerMachineFactory(token, "trainer")
  )
  const [isGameOver, setGameOver] = useState(false)
  const [streak, setStreak] = useState(0)
  const [results, setResults] = useState({})
  useEffect(() => {
    if (gameState.value === "score") {
      const playerMove = gameState.context.holds
        .map((isHold, index) => (isHold ? `HOLD_${index + 1}` : null))
        .filter(x => x)
      // gameState.context.strategy
      const strategy = gameState.context.strategy
      const correctMove = strategy.strategy
      const win =
        JSON.stringify(playerMove) === JSON.stringify(correctMove)
          ? true
          : false
      setResults({
        playerMove,
        strategy,
        win,
      })
      // console.log(results)
      if (win) {
        setStreak(streak + 1)
      } else {
        setGameOver(true)
      }
    }
  }, [gameState.value])
  return (
    <>
      <SEO title="Video Poker Trainer" />
      <PokerUI {...{ gameState, gameSend, token }}>
        {isGameOver ? (
          <pre>{JSON.stringify(results, null, 2)}</pre>
        ) : gameState.value === "score" ? (
          results !==
          undefined ? null : // <h3>{`Correct! Rule #${results.strategy.rule_number}: ${results.strategy.rule}`}</h3>
          null
        ) : null}
      </PokerUI>
      {isGameOver ? (
        <>
          <h3>{`Game Over, Final Score: ${streak}`}</h3>
          <Link to="/poker" className="btn btn-success">
            Back to Lobby
          </Link>
          {/* <button
            className="btn btn-success"
            onClick={() => {
              window.location.reload()
            }}
          >
            Try Again
          </button> */}
        </>
      ) : null}
      <h3>{`state: ${gameState.value}`}</h3>
      <h3>{`streak: ${streak}`}</h3>
      {/* <pre>{JSON.stringify(gameState.context, null, 2)}</pre> */}
    </>
  )
}

const GamePage = () => {
  const { isClient } = useIsClient()
  if (!isClient) return null
  return <Game />
}
export default GamePage
