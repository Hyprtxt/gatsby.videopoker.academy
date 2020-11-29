import React from "react"
import { useMachine } from "@xstate/react"
import fetchMachineFactory from "src/machines/fetch"
const GATSBY_API_URL = process.env.GATSBY_API_URL || "http://localhost:1337"

const PreloadCredits = ({ gameState, token }) => {
  const [fetchState] = useMachine(
    fetchMachineFactory(`${GATSBY_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  )
  return (
    <>
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
    </>
  )
}

export default PreloadCredits
