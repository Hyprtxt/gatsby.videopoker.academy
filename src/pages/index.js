import React from "react"
import { Link } from "gatsby"

import Layout from "src/components/layout"
// import Image from "src/components/image"
import SEO from "src/components/seo"

const IndexPage = () => (
  <>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>This is a website.</p>
    <Link to="/game">Play the game</Link>
  </>
)

export default IndexPage
