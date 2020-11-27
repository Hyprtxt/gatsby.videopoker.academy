import React from "react"
import { Link } from "gatsby"

import SEO from "src/components/seo"

const SecondPage = () => (
  <>
    <SEO title="Privacy Policy" />
    <h1>Privacy Policy</h1>
    <p>
      Dont give me data you don't want to see public. It's just video poker.
    </p>
    <Link to="/">Go back to the homepage</Link>
  </>
)

export default SecondPage
