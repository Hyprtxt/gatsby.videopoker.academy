import { Machine, assign } from "xstate"

const loginGoogle = () =>
  fetch(`${API_HOST}/connect/google`, {
    method: "GET",
  }).then(response => response.json())

const sessionMachine = Machine({
  id: "session",
  initial: "inactive",
  states: {
    // load from localStorage?
    inactive: {
      on: { TOGGLE: "active" },
    },
    active: {
      on: { TOGGLE: "inactive" },
    },
  },
})
