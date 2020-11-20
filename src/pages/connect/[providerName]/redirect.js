import React, { useState } from "react"
// import { Row, Col, Container } from "react-bootstrap"
// import { graphql } from "gatsby"
import Layout from "src/components/layout"
// import SEO from "src/components/seo"
import { useLocation } from "@reach/router"
import { useMachine } from "@xstate/react"
// import sessionMachine from "src/machines/session"
import createSessionMachine from "../../../machines/session"

const GATSBY_API_URL = process.env.GATSBY_API_URL || "http://localhost:1337"

const Redirect = ({ providerName }) => {
  const location = useLocation()
  const loginURL = `${GATSBY_API_URL}/auth/${providerName}/callback${location.search}`
  console.log(loginURL)
  const [state, send] = useMachine(createSessionMachine(loginURL))
  // send('tryLogin')

  // const navigate = useNavigate()
  const [text, setText] = useState("Loading...")

  // useEffect(() => {
  //   // Successfully logged with the provider
  //   // Now logging with strapi by using the access_token (given by the provider) in props.location.search
  //   fetch(loginURL)
  //     .then(res => {
  //       if (res.status !== 200) {
  //         throw new Error(`Couldn't login to Strapi API. Status: ${res.status}`)
  //       }
  //       return res
  //     })
  //     .then(res => res.json())
  //     .then(res => {
  //       console.log(res)
  //       window.localStorage.setItem("token", res.jwt)
  //       window.localStorage.setItem("user", JSON.stringify(res.user))
  //       setText(
  //         `Hi ${res.user.username} You have been successfully logged in. You will be redirected in a few seconds...`
  //       )
  //       setTimeout(() => navigate("/", { replace: true }), 3500) // Redirect
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       setText("An error occurred, please see the developer console.")
  //     })
  // }, [providerName, location.search])
  return (
    <Layout pageInfo={{ pageName: "index" }}>
      {/* <SEO title="OAuth2" /> */}
      <p>{text}</p>
      {/* <pre>
              {JSON.stringify(session, null, 2)}
            </pre> */}
      {/* <pre>{JSON.stringify(location, null, 2)}</pre> */}
    </Layout>
  )
}

export default Redirect
