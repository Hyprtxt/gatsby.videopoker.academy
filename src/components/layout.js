/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
// import PropTypes from "prop-types"
import Header from "./header"
import ToastDemo from "src/components/toast-demo"

const Layout = props => {
  const { children } = props
  return (
    <>
      <Header siteTitle={`VideoPoker.Academy`} />
      {children}

      <footer
        style={{
          marginTop: `2rem`,
        }}
      >
        <p>© {new Date().getFullYear()}, built by Taylor</p>
      </footer>
      <ToastDemo />
      <div className="header-spacer" style={{ marginTop: "124px" }}></div>
    </>
  )
}

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// }

export default Layout
