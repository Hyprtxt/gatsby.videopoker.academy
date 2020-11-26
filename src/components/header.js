import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle, user }) => (
  <header className="mb-3">
    <div className="bg-info px-3 py-1">
      <Link to="/">
        <h1>{siteTitle}</h1>
      </Link>
      <p>{`User: ${user}`}</p>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
