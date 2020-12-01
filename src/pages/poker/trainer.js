import React, { useContext } from "react"
import { store } from "src/store"
import SEO from "src/components/seo"
import pokerMachineFactory from "src/machines/poker-trainer"
import { useMachine } from "@xstate/react"
import TrainerPokerUI from "src/components/poker-ui/trainer"
import useIsClient from "src/hooks/use-is-client"

const TrainerGame = () => {
  const sessionMachine = useContext(store)
  const { state } = sessionMachine
  const { token } = state.context
  const [gameState, gameSend] = useMachine(
    pokerMachineFactory(token, "trainer")
  )
  return (
    <>
      <SEO title="Video Poker Trainer" />
      <TrainerPokerUI {...{ gameState, gameSend, token }} />
      <h3>{`state: ${gameState.value}`}</h3>
      <h3>{`streak: ${gameState.context.streak}`}</h3>
      {/* <pre>{JSON.stringify(gameState.context, null, 2)}</pre> */}
    </>
  )
}

const GamePage = () => {
  const { isClient } = useIsClient()
  if (!isClient) return null
  return <TrainerGame />
}
export default GamePage
