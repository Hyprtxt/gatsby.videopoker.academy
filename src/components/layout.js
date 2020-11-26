/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

// import sessionMachine from "src/machines/session"
import { useMachine } from "@xstate/react"

import Header from "./header"
import "./layout.css"

const Layout = props => {
  const { children } = props
  console.log(props, "HERE")
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  {
    /* <div
  style={{
    margin: `0 auto`,
    maxWidth: 960,
    padding: `0 1.0875rem 1.45rem`,
  }}
></div> */
  }

  return (
    <>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <main>{children}</main>
      {/* <pre>{JSON.stringify(state.value, null, 2)}</pre>
      <pre>{JSON.stringify(state.context, null, 2)}</pre> */}
      <footer
        style={{
          marginTop: `2rem`,
        }}
      >
        © {new Date().getFullYear()}, built by Taylor
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
