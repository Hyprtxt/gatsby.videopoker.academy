import React, { useContext } from "react"
import { store } from "src/store"
// import { Link } from "gatsby"
// import Layout from "src/components/layout"
import SEO from "src/components/seo"
import pokerMachineFactory from "src/machines/poker"
import { useMachine } from "@xstate/react"
import PokerUI from "src/components/poker-ui"
import fetchMachineFactory from "src/machines/fetch"
import useIsClient from "src/hooks/use-is-client"

const GATSBY_API_URL = process.env.GATSBY_API_URL || "http://localhost:1337"

const Game = () => {
  const sessionMachine = useContext(store)
  const { state, send } = sessionMachine
  const { token } = state.context
  const [gameState, gameSend] = useMachine(pokerMachineFactory(token))
  const [fetchState] = useMachine(
    fetchMachineFactory(`${GATSBY_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  )
  return (
    <>
      <SEO title="Video Poker" />
      <p>
        {gameState.value === "idle"
          ? fetchState.value === "ready"
            ? `Credits: ${fetchState.context.response.Credits}`
            : "Credits: loading..."
          : null}
      </p>
      {fetchState.value === "error" ? (
        <p>{fetchState.context.error}, Do you have an account?</p>
      ) : null}
      <PokerUI {...{ gameState, gameSend }} />
      <h3>{gameState.value}</h3>
      {/* <pre>{JSON.stringify(fetchState.context, null, 2)}</pre> */}
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
