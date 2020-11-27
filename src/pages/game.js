import React, { useContext } from "react"
import { store } from "src/store"
// import { Link } from "gatsby"
// import Layout from "src/components/layout"
import SEO from "src/components/seo"
import pokerMachineFactory from "src/machines/poker"
import { useMachine } from "@xstate/react"

import PokerUI from "src/components/poker-ui"

const GamePage = () => {
  const sessionMachine = useContext(store)
  const { state, send } = sessionMachine
  let userID = state.context.user !== null ? state.context.user.id : 1
  const [gameState, gameSend] = useMachine(pokerMachineFactory(userID))
  return (
    <>
      <SEO title="Video Poker" />
      {state.value === "active" && <p>{`Credits: ${state.context.credits}`}</p>}
      <p>{`Credits: ${gameState.context.credits}`}</p>
      <PokerUI {...{ gameState, gameSend }} />
      <h3>{gameState.value}</h3>
      <pre>{JSON.stringify(gameState.context, null, 2)}</pre>
    </>
  )
}
export default GamePage
