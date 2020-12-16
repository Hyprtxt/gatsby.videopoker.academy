import React, { useContext } from "react"
import { useMachine } from "@xstate/react"
import useIsClient from "src/hooks/use-is-client"
import { store } from "src/store"
import pokerMachineFactory from "src/machines/poker"
import SEO from "src/components/seo"
import PokerUI from "src/components/poker-ui"

const Game = () => {
  const sessionMachine = useContext(store)
  const { state } = sessionMachine
  const { token } = state.context
  const [gameState, gameSend] = useMachine(
    pokerMachineFactory(token, "classic")
  )
  return (
    <>
      <SEO title="Classic Video Poker - Jacks or Better" />
      <PokerUI {...{ gameState, gameSend, token }} />
      <h3>{gameState.value}</h3>
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
