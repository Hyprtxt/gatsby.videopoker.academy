import React from "react"
import OneToast from "src/components/one-toast"

const Toaster = ({ context, send }) => (
  // <><pre>{JSON.stringify(context, null, 2)}</pre></>
  <div
    aria-live="polite"
    aria-atomic="true"
    className="bg-dark position-relative bd-example-toasts"
  >
    <div
      className="toast-container position-absolute p-3 bottom-0 end-0"
      id="toastPlacement"
    >
      {context.toasts
        ? context.toasts.map((toast, index) => (
            <OneToast handler={send} toast={toast} key={index} />
          ))
        : ""}
    </div>
  </div>
)

export default Toaster
