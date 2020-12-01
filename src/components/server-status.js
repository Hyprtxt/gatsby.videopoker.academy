import React from "react"
import { useMachine } from "@xstate/react"
import fetchMachineFactory from "src/machines/fetch"

const GATSBY_API_URL = process.env.GATSBY_API_URL || "http://localhost:1337"

const ServerStatus = ({ size }) => {
  const [fetchState] = useMachine(
    fetchMachineFactory(`${GATSBY_API_URL}/users-permissions/`, {})
  )
  let iconSize = size || "small"
  const icons = {
    small: "●",
    large: "⬤",
  }
  const color = {
    loading: "warning",
    ready: "success",
    error: "danger",
  }
  return (
    <p className="server-status float-right">
      <span className={`text-${color[fetchState.value]}`}>
        {icons[iconSize]}
      </span>
      {/* <pre>{JSON.stringify(fetchState.value, null, 2)}</pre> */}
    </p>
  )
}
export default ServerStatus
