import React from "react"
import { Link } from "gatsby"

import Layout from "src/components/layout"
// import Image from "src/components/image"
import SEO from "src/components/seo"

const IndexPage = () => (
  <>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>This is a website, you may:</p>
    <ul>
      <li>
        <Link to="https://api.videopoker.academy/connect/google">
          Login with Google
        </Link>
      </li>
      <li>
        <Link to="/game">Play the game</Link>
      </li>
    </ul>
    <div className="clearfix"></div>
  </>
)

export default IndexPage
