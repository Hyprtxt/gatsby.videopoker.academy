import React, { useContext } from "react"
import { store } from "src/store"
// import { Link } from "gatsby"
import SEO from "src/components/seo"
import { useMachine } from "@xstate/react"
import userProfileMachineFactory from "src/machines/user-profile"
// import fetchTriggerMachineFactory from "src/machines/fetch-trigger"

const PlayerProfileForm = ({ token }) => {
  const [user, send] = useMachine(userProfileMachineFactory(token))
  console.log( user.context.handle )
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        send(e.type.toUpperCase())
      }}
    >
      <div className="form-group">
        <label htmlFor="handle">
          Handle
          <input
            type="text"
            className="form-control"
            id="handle"
            aria-describedby="handleHelp"
            value={user.context.handle }
            onChange={e =>
              send(e.type.toUpperCase(), { value: e.target.value })
            }
          />
        </label>
        <small id="handleHelp" className="form-text text-muted">
          This is your public name.
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="credits">
          Credits
          <input
            type="text"
            className="form-control"
            id="credits"
            value={user.context.credits}
            readOnly
          />
        </label>
      </div>
      <div className="form-group">
        <label htmlFor="provider">
          Provider
          <input
            type="text"
            className="form-control"
            id="provider"
            value={user.context.provider}
            readOnly
          />
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={user.value !== "active"}
      >
        Update
      </button>
      {/* <pre>{JSON.stringify(user.value, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(user.context, null, 2)}</pre> */}
    </form>
  )
}

const PlayerPage = () => {
  const sessionMachine = useContext(store)
  const { state } = sessionMachine
  const token = state !== undefined ? state.context.token : null
  return (
    <>
      <SEO title="Home" />
      <div className="p-5">
        <h1>Your Profile</h1>
        <PlayerProfileForm token={token} />
      </div>
    </>
  )
}

export default PlayerPage
