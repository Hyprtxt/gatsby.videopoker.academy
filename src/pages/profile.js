import React, { useContext, useEffect } from "react"
import { store } from "src/store"
import { Link } from "gatsby"
import SEO from "src/components/seo"

const PlayerPage = () => {
  const sessionMachine = useContext(store)
  let { state } = sessionMachine
  let user = "people"
  useEffect(() => {
    if (state.value === "active") {
      user = state.context.user.username
      // user = state.context.user.Handle
    }
  })
  return (
    <>
      <SEO title="Home" />
      <div className="p-5">
        <h1>{`Hi ${user}`}</h1>
        <p>This is a website, you may:</p>
        <ul>
          <li>HandleForm</li>
          <li>PlayerInfo</li>
        </ul>
      </div>
    </>
  )
}

export default PlayerPage
