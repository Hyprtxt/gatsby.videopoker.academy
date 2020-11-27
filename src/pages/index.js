import React, { useContext } from "react"
import { store } from "src/store"
import { Link } from "gatsby"
import SEO from "src/components/seo"
import useIsClient from "src/hooks/use-is-client"

const IndexPage = () => {
  const { isClient, key } = useIsClient()
  const sessionMachine = useContext(store)
  let { state } = sessionMachine
  let user = "people"
  if (!isClient) {
    state = { value: "inactive" }
  }
  if (state.value === "active") {
    user = state.context.user.username
    // user = state.context.user.Handle
  }
  return (
    <>
      <SEO title="Home" />
      <div className="p-5">
        <h1>{`Hi ${user}`}</h1>
        <p>This is a website, you may:</p>
        <ul>
          {state.value === "inactive" && <li>P̶l̶a̶y̶ ̶t̶h̶e̶ ̶g̶a̶m̶e̶ ̶o̶n̶l̶i̶n̶e̶</li>}
          {state.value === "inactive" && [
            <li>
              <Link to="/login">Join/Login with provider</Link>
            </li>,
          ]}
          {state.value === "active" && (
            <li>
              <Link to="/game">Play this game online</Link>
            </li>
          )}
          <li>
            <Link to="/offline">Play this game on localStorage</Link>
          </li>
          <li>
            <a href="//knockout.videopoker.academy">Play JS Video Poker</a>
          </li>
          <li>
            <a href="//jquery.videopoker.academy">Play JQuery Poker Trainer</a>
          </li>
          {/* <li>
            <Link to="/page-2">Visit Page 2</Link>
          </li> */}
          {state.value === "active" && (
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          )}
        </ul>
        <div className="clearfix"></div>
      </div>
    </>
  )
}

export default IndexPage
