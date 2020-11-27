import React, { useContext } from "react"
import { store } from "src/store"
// import { Link } from "gatsby"
// import Layout from "src/components/layout"
import SEO from "src/components/seo"
import offlinePokerMachineFactory from "src/machines/offline-poker"
import { useMachine } from "@xstate/react"
import PokerUI from "src/components/poker-ui"
import useIsClient from "src/hooks/use-is-client"

const GamePage = () => {
  const sessionMachine = useContext(store)
  const { state, send } = sessionMachine
  const { isClient, key } = useIsClient()
  let startCredits = 100
  if (isClient) {
    startCredits = window.localStorage.getItem("credits")
  }
  const LoadedCredits = parseInt(startCredits)
  const [gameState, gameSend] = useMachine(
    offlinePokerMachineFactory(LoadedCredits ? LoadedCredits : 100)
  )
  return (
    <>
      <SEO title="Offline Video Poker" />
      <PokerUI {...{ gameState, gameSend }} />
      {/* <h3>{gameState.value}</h3> */}
      {/* <pre>{JSON.stringify(gameState.context, null, 2)}</pre> */}
      <div className="info p-3">
        <p>Want more credits? Paste this into the console</p>
        <pre>
          window.localStorage.setItem('credits', 100);window.location.reload()
        </pre>
      </div>
    </>
  )
}
export default GamePage
