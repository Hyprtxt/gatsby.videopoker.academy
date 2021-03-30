import React, { useContext, useEffect, useState, useRef } from "react"
import { Toast } from "bootstrap"
import { store } from "src/store"
// import { Link } from "gatsby"
import SEO from "src/components/seo"
import { useMachine } from "@xstate/react"
import userProfileMachineFactory from "src/machines/user-profile"
// import fetchTriggerMachineFactory from "src/machines/fetch-trigger"

const ToastDemo = () => {
  var [toast, setToast] = useState(false)
  const toastRef = useRef()

  useEffect(() => {
    var myToast = toastRef.current
    var bsToast = bootstrap.Toast.getInstance(myToast)

    if (!bsToast) {
      // initialize Toast
      bsToast = new Toast(myToast, { autohide: false })
      // hide after init
      bsToast.hide()
      setToast(false)
    } else {
      // toggle
      toast ? bsToast.show() : bsToast.hide()
    }
  })

  return (
    <div className="py-2">
      <button
        className="btn btn-success"
        onClick={() => setToast(toast => !toast)}
      >
        Toast {toast ? "hide" : "show"}
      </button>
      <div className="toast" role="alert" ref={toastRef}>
        <div className="toast-header">
          <strong className="me-auto">Bootstrap 5</strong>
          <small>4 mins ago</small>
          <button
            type="button"
            className="btn-close"
            onClick={() => setToast(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">Hello, world! This is a toast message.</div>
      </div>
    </div>
  )
}

const PlayerProfileForm = ({ token }) => {
  const [user, send] = useMachine(userProfileMachineFactory(token))
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
            value={user.context.handle}
            onChange={e => send("CHANGE_HANDLE", { value: e.target.value })}
          />
        </label>
        <small id="handleHelp" className="form-text text-muted">
          This is your public name.
        </small>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={user.context.joinTrainerLeaderboards}
          id="joinTrainerLeaderboards"
          onChange={e => {
            console.log(e.type.toUpperCase(), e.target.checked)
            send("CHANGE_JOIN_TRAINER_LEADERBOARDS", {
              value: e.target.checked,
            })
          }}
        />
        <label className="form-check-label" htmlFor="joinTrainerLeaderboards">
          Show on Trainer Leaderboards
        </label>
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
      <p>Nice and Toasty!!!</p>
      <ToastDemo />
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
