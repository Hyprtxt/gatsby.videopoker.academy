import React, { useContext } from "react"
import { Link } from "gatsby"
import { store } from "src/store"
import PropTypes from "prop-types"
import useIsClient from "src/hooks/use-is-client"
import ServerStatus from "src/components/server-status"

const Header = ({ siteTitle }) => {
  const { isClient, key } = useIsClient()
  const sessionMachine = useContext(store)
  const { state, send } = sessionMachine
  let user = "unknown"
  if (!isClient) return null
  // console.log("HEADER", state.context)
  if (state !== undefined) {
    if (state.value === "active") {
      user = state.context.user.username
      // user = state.context.user.Handle
    }
  }
  return (
    <header className="mt-3 fixed-bottom">
      <div className="bg-info px-3 py-1">
        <ServerStatus success={false} />
        <Link to="/">
          <h1>{siteTitle}</h1>
        </Link>
        <p>{`User: ${user}`}</p>
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
