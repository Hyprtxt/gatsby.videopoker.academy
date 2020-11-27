import React, { useContext } from "react"
import { Link } from "gatsby"
import { store } from "src/store"
import PropTypes from "prop-types"

const Header = ({ siteTitle }) => {
  const sessionMachine = useContext(store)
  const { state, send } = sessionMachine
  let user = "unknown"
  // console.log("HEADER", state)
  if (state !== undefined) {
    if (state.value === "active") {
      user = state.context.user.username
      // user = state.context.user.Handle
    }
  }
  return (
    <header className="mb-3">
      <div className="bg-info px-3 py-1">
        <Link to="/">
          <h1>{siteTitle}</h1>
        </Link>
        <p>{`User: ${user}`}</p>
        {/* <pre>{JSON.stringify(state.value, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(state.context.user.Credits, null, 2)}</pre> */}
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
