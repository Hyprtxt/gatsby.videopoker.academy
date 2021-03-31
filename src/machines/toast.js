import { createMachine, assign, sendParent } from "xstate"

export const createTodoMachine = ({ id, message, hidden }) =>
  createMachine(
    {
      id: "toast",
      initial: "",
      context: {
        id,
        message,
        hidden,
      },
      on: {
        HIDE_TOAST: {
          actions: [
            assign({ hidden: true }),
            // "hideToast"
          ],
        },
      },
      states: {
        visible: {},
        hidden: {
          type: "final",
          onEntry: sendParent(context => ({
            type: "TODO.DELETE",
            id: context.id,
          })),
        },
      },
    },
    {
      actions: {
        hideToast: sendParent(context => ({
          type: "TOAST.HIDDEN",
          todo: context,
        })),
        focusInput: () => {},
      },
    }
  )
