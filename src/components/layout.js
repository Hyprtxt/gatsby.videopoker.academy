/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import ReactXStateContext from "src/ReactXStateContext"
// import sessionMachine from "src/machines/session"
import { useMachine } from "@xstate/react"

import Header from "./header"
import "./layout.sass"

class Layout extends React.Component {
  constructor(props) {
    console.log(props, "HERE")
    super(props)
    this.children = props.children
  }
  static contextType = ReactXStateContext
  render() {
    let user = "nobody"
    if (this.context.value === "active") {
      user = this.context.context.user.username
    }
    return (
      <>
        <Header siteTitle={`VideoPoker.Academy`} user={user} />
        <pre>{JSON.stringify(this.context.value, null, 2)}</pre>
        <main>{this.children}</main>
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
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
