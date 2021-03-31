import React, { useRef, useEffect } from "react"
import { Toast } from "bootstrap"

const OneToast = props => {
  const { toast, handler } = props
  const { id, hide, message, timestamp } = toast
  const toastRef = useRef()
  const destroyToast = () => {
    handler("TOAST.DESTROY", { id })
  }
  useEffect(() => {
    const theRef = toastRef.current
    let bsToast = Toast.getInstance(theRef)
    if (!bsToast) {
      bsToast = new Toast(theRef, { autohide: false })
    }
    hide ? bsToast.hide() : bsToast.show()
    theRef.addEventListener("hidden.bs.toast", destroyToast)
    return () => {
      theRef.removeEventListener("hidden.bs.toast", destroyToast)
    }
  })
  return (
    <div
      className="toast"
      // className={`toast toast-${id}`}
      role="alert"
      ref={toastRef}
    >
      <div className="toast-header">
        <strong className="me-auto">Alert!</strong>
        <small>{timestamp}</small>
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            handler("TOAST.HIDE", { id })
          }}
          // data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">
        {message}
        <br />
        <small>{id}</small>
        <div className="mt-2 pt-2 border-top">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              handler("TOAST.HIDE", { id })
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default OneToast
