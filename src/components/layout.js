/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
// import PropTypes from "prop-types"
import Header from "./header"
import { store } from "src/store"
// import { useMachine } from "@xstate/react"
import Toaster from "src/components/toaster"

// <button
//   className="btn btn-success"
//   onClick={() =>
//     toastSend("TOAST.CREATE", { message: "This is a cool toast!" })
//   }
// >
//   {/* Toast {toast_active ? "hide" : "show"} */}
//   Toast BTN
// </button>

const Layout = props => {
  const { children } = props
  const { toastState, toastSend } = React.useContext(store)
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
      <Toaster context={toastState.context} send={toastSend} />
      <div className="header-spacer" style={{ marginTop: "124px" }}></div>
    </>
  )
}

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// }

export default Layout
