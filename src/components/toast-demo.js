import React, {
  //useState,
  useRef,
  useEffect,
} from "react"
import { Toast } from "bootstrap"

import { Machine, assign } from "xstate"
import { values } from "cypress/types/lodash"

const toastMachineFactory = () =>
  Machine(
    {
      initial: "idle",
      context: {
        key: "value",
      },
      states: {
        idle: {
          on: {
            START: {
              target: "waiting",
            },
          },
        },
      },
    },
    {}
  )

const OneToast = props => {
  const { children } = props
  // let [toast_active, setToast] = useState(false)
  const toastRef = useRef()
  useEffect(() => {
    var myToast = toastRef.current
    var bsToast = Toast.getInstance(myToast)
    //     // initialize Toast
    if (!bsToast) {
      bsToast = new Toast(myToast, { autohide: true })
    }

    // else {
    //     // hide after init
    //     // bsToast.hide()
    //     // setToast(true)
    //     // toggle
    //     toast_active ? bsToast.show() : bsToast.hide()
    //   }
  })
  return (
    <div className="toast" role="alert" ref={toastRef}>
      <div className="toast-header">
        <strong className="me-auto">Bootstrap 5</strong>
        <small>4 mins ago</small>
        <button
          type="button"
          className="btn-close"
          // onClick={() => setToast(false)}
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">
        {children}
        <div className="mt-2 pt-2 border-top">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            data-bs-dismiss="toast"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const ToastDemo = () => {
  return (
    <div className="py-2">
      {/* <p>Nice and Toasty!!!</p> */}
      <button
        className="btn btn-success"
        // onClick={() => setToast(toast => !toast)}
      >
        {/* Toast {toast_active ? "hide" : "show"} */}
        Toast BTN
      </button>
      <p>A TOAST HERE</p>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="bg-dark position-relative bd-example-toasts"
      >
        <div
          className="toast-container position-absolute p-3 bottom-0 end-0"
          id="toastPlacement"
        >
          <OneToast>Hello, world! This is a nice toast message.</OneToast>
          <OneToast>Another Toast.</OneToast>
        </div>
      </div>
    </div>
  )
}

export default ToastDemo
