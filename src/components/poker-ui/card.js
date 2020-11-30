import React from "react"

const Card = ({ index, state, handleClick, children, holdDataSource }) => {
  // console.log(children[0], children[1])
  let holdData = state.context.holds
  console.log("holdDataSource", holdDataSource)
  if (holdDataSource) {
    holdData = holdDataSource
  }
  const held = holdData[index]
  return (
    <div className={`card-unit key-${index} ${held ? "hold" : ""}`}>
      <div
        className="card"
        onClick={handleClick}
        role="button"
        tabIndex={index}
      >
        <span className={`info d-none-md`}>
          {children[1]}
          <span className={`suit-${children[0]}`}>{children[0]}</span>
        </span>
        <span className={`value`}>{children[1]}</span>
        <span className={`suit suit-${children[0]}`}>{children[0]}</span>
      </div>
      {["score", "loadingResults", "result"].indexOf(state.value) !== -1 && (
        <button className="btn btn-info" onClick={handleClick}>
          {held ? "Held" : "Hold"}
        </button>
      )}
    </div>
  )
}

export default Card
