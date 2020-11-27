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

const GamePage = () => {
  const { isClient, key } = useIsClient()
  const sessionMachine = useContext(store)
  const { state, send } = sessionMachine
  // console.log("GamePage", state.context)
  let token = ""
  if (state !== undefined) {
    token = state.context.token
  }
  const [gameState, gameSend] = useMachine(pokerMachineFactory(token))
  const [fetchState] = useMachine(
    fetchMachineFactory(`${GATSBY_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  )
  if (!isClient) return null
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
      <PokerUI {...{ gameState, gameSend }} />
      <h3>{gameState.value}</h3>
      {/* <pre>{JSON.stringify(gameState.context, null, 2)}</pre> */}
    </>
  )
}
export default GamePage
