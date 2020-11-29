import React, { useContext } from "react"
import { store } from "src/store"
// import { Link } from "gatsby"
// import Layout from "src/components/layout"
import SEO from "src/components/seo"
import pokerMachineFactory from "src/machines/poker"
import { useMachine } from "@xstate/react"
import PokerUI from "src/components/poker-ui"
import PreloadCredits from "src/components/poker-ui/credits"
import useIsClient from "src/hooks/use-is-client"

const Game = () => {
  const sessionMachine = useContext(store)
  const { state, send } = sessionMachine
  const { token } = state.context
  const [gameState, gameSend] = useMachine(
    pokerMachineFactory(token, "trainer")
  )
  return (
    <>
      <SEO title="Video Poker" />
      {/* // @todo gaurd this if the mode isnt right */}
      {/* <PreloadCredits {...{ gameState, token }} /> */}
      <PokerUI {...{ gameState, gameSend }} />
      <h3>{gameState.value}</h3>
      {/* <pre>{JSON.stringify(fetchState.context, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(gameState.context, null, 2)}</pre> */}
    </>
  )
}

const GamePage = () => {
  const { isClient, key } = useIsClient()
  if (!isClient) return null
  return <Game />
}
export default GamePage
