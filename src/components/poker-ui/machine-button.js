import React from "react"

const MachineButton = ({ gameState, gameSend, eventSlug, activeOn, id }) =>
  activeOn.indexOf(gameState.value) !== -1 ? (
    <button
      id={id}
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
