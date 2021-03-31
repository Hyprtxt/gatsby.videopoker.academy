import React from "react"

// import { Machine, assign } from "xstate"

import { useMachine } from "@xstate/react"
import { toasterMachine } from "src/machines/toaster-machine"
import Toaster from "src/components/toaster"

const ToastDemo = () => {
  // console.log(toasterMachine)
  const [toastState, toastSend] = useMachine(toasterMachine)
  // console.log
  return (
    <>
      <div className="py-2">
        {/* <p>Nice and Toasty!!!</p> */}
        <button
          className="btn btn-success"
          onClick={() =>
            toastSend("TOAST.CREATE", { message: "This is a cool toast!" })
          }
        >
          {/* Toast {toast_active ? "hide" : "show"} */}
          Toast BTN
        </button>
        {/* <p>A TOAST HERE</p> */}
        {/* <pre>{JSON.stringify(toastState.context, null, 2)}</pre> */}
      </div>
      <Toaster context={toastState.context} send={toastSend} />
    </>
  )
}

export default ToastDemo
