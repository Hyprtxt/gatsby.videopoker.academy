import React, { useContext } from "react"
import { store } from "src/store"
import { Link } from "gatsby"
import SEO from "src/components/seo"

const IndexPage = () => {
  const sessionMachine = useContext(store)
  const { state } = sessionMachine

  return (
    <>
      <SEO title="Home" />
      <h1>Hi people</h1>
      <p>This is a website, you may:</p>
      <ul>
        {state.value === "inactive" && (
          <li>
            <a href="https://api.videopoker.academy/connect/google">
              Login with Google
            </a>
          </li>
        )}
        <li>
          <Link to="/game">Play the game</Link>
        </li>
        <li>
          <Link to="/page-2">Visit Page 2</Link>
        </li>
        {state.value === "active" && (
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        )}
      </ul>
      <div className="clearfix"></div>
    </>
  )
}

export default IndexPage
