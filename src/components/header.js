import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle, user }) => (
  <header className="mb-3">
    <div className="bg-info">
      <h1>{siteTitle}</h1>
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
