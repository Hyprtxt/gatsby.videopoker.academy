import React from "react"
import SEO from "src/components/seo"
import { Link } from "gatsby"

const GameViewPage = () => (
  <>
    <SEO title="Poker Game ID: *******" />
    <div className="p-5">
      <ul>
        <li>
          <Link to={`classic`} className="btn btn-success">
            Classic
          </Link>
          <p>Jacks or Better Poker</p>
        </li>
        <li>
          <Link to={`casual`} className="btn btn-success">
            Casual
          </Link>
          <p>Classic with a suggest button</p>
        </li>
        <li>
          <Link to={`trainer`} className="btn btn-success">
            Trainer
          </Link>
          <p>How long can you last?</p>
        </li>
      </ul>
    </div>
  </>
)

export default GameViewPage
