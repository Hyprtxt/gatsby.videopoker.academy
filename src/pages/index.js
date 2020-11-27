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
        <li>
          <Link to="/offline">Play the game offline</Link>
        </li>
        {state.value === "inactive" && (
          <>
            <li>P̶l̶a̶y̶ ̶t̶h̶e̶ ̶g̶a̶m̶e̶ ̶o̶n̶l̶i̶n̶e̶</li>
            <li>
              <a href="https://api.videopoker.academy/connect/google">
                Join/Login
              </a>
            </li>
          </>
        )}
        {state.value === "active" && (
          <li>
            <Link to="/game">Play the game online</Link>
          </li>
        )}
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
