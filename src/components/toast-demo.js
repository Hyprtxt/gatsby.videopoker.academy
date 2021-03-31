import React from "react"

// import { Machine, assign } from "xstate"

import { useMachine } from "@xstate/react"
import { toasterMachine } from "src/machines/toaster-machine"
import Toaster from "src/components/toaster"

const ToastDemo = () => {
  // console.log(toasterMachine)
  const [state, send] = useMachine(toasterMachine)
  // console.log
  return (
    <>
      <div className="py-2">
        {/* <p>Nice and Toasty!!!</p> */}
        <button
          className="btn btn-success"
          onClick={() => send("TOAST.CREATE", { message: "This is a toast!" })}
        >
          {/* Toast {toast_active ? "hide" : "show"} */}
          Toast BTN
        </button>
        {/* <p>A TOAST HERE</p> */}
        <pre>{JSON.stringify(state.context, null, 2)}</pre>
      </div>
      <Toaster context={state.context} send={send} />
    </>
  )
}

export default ToastDemo
