import React from "react"

const MachineButton = ({ gameState, gameSend, eventSlug, activeOn }) =>
  activeOn.indexOf(gameState.value) !== -1 ? (
    <button
      className="btn btn-primary"
      onClick={e => {
        e.preventDefault()
        gameSend(eventSlug)
      }}
    >
      {eventSlug}
    </button>
  ) : null

export default MachineButton
