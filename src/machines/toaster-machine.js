import { Machine, assign } from "xstate"
import { v4 as uuidv4 } from "uuid"

const createToast = message => {
  return {
    id: uuidv4(),
    message,
    timestamp: new Date().toLocaleTimeString(),
    hide: false,
  }
}

export const toasterMachine = Machine({
  id: "toaster",
  context: {
    toasts: [],
  },
  initial: "ready",
  states: {
    ready: {},
  },
  on: {
    "TOAST.CREATE": {
      actions: [
        (context, event) => {
          console.log("TOAST.CREATE", event.id)
        },
        assign({
          toasts: (context, event) => {
            const newToast = createToast(event.message.trim())
            return context.toasts.concat({
              ...newToast,
            })
          },
        }),
      ],
    },
    "TOAST.HIDE": {
      actions: [
        (context, event) => {
          console.log("TOAST.HIDE", event.id)
        },
        assign({
          toasts: (context, event) =>
            context.toasts.map(toast => {
              if (toast.id === event.id) {
                toast.hide = true
              }
              return toast
            }),
        }),
      ],
    },
    "TOAST.DESTROY": {
      actions: [
        (context, event) => {
          console.log("TOAST.DESTROY", event)
        },
        assign({
          toasts: (context, event) =>
            context.toasts.filter(toast => toast.id !== event.id),
        }),
      ],
    },
  },
})
