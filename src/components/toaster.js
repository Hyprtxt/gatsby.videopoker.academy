import React from "react"
import OneToast from "src/components/one-toast"

const Toaster = ({ context, send }) => (
  <>
    {/* <pre>{JSON.stringify(context, null, 2)}</pre> */}
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed-bottom toaster-frame"
    >
      <div
        className="toast-container p-3 position-absolute bottom-0 end-0"
        id="toastPlacement"
      >
        {context.toasts
          ? context.toasts.map((toast, index) => (
              <OneToast handler={send} toast={toast} key={index} />
            ))
          : ""}
      </div>
    </div>
  </>
)

export default Toaster
