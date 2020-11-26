import { Machine, assign } from "xstate"
import qs from "qs"

const GATSBY_API_URL = process.env.GATSBY_API_URL || "http://localhost:1337"
// console.log("GATSBY_API_URL", GATSBY_API_URL)

const holdToggle = hold_index =>
  assign({
    holds: ctx =>
      ctx.holds.map((current, index) =>
        index === hold_index ? !current : current
      ),
  })

const holdCard = hold_index =>
  assign({
    holds: ctx =>
      ctx.holds.map((current, index) =>
        index === hold_index ? true : current
      ),
  })

const fetchGame = user_id =>
  fetch(`${GATSBY_API_URL}/play`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      User: user_id,
    }),
  }).then(response => response.json())
// .then(response => {
//   console.log("FETCH", response.json())
//   return response.json()
// })

const fetchResults = (game_id, data) => {
  // console.log("Doing a fetch", `${GATSBY_API_URL}/draw/${game_id}`)
  return fetch(`${GATSBY_API_URL}/draw/${game_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(response => response.json())
}
const pokerMachineFactory = user_id =>
  Machine({
    initial: "idle",
    context: {
      user_id,
      game_id: null,
      hand: null,
      draw: null,
      final_cards: null,
      holds: [false, false, false, false, false],
      result: null,
    },
    states: {
      idle: {
        on: {
          START: {
            target: "loadingGame",
          },
        },
      },
      loadingGame: {
        invoke: {
          id: "getPlay",
          src: (context, event) => fetchGame(context.user_id),
          onDone: {
            target: "active",
            actions: assign({
              draw: null,
              final_cards: null,
              hand: (context, event) => event.data.Hand,
              game_id: (context, event) => {
                console.log(event.data)
                return event.data.id
              },
            }),
          },
          onError: {
            target: "failure",
          },
        },
      },
      active: {
        on: {
          HOLD_TOGGLE_1: {
            actions: holdToggle(0),
          },
          HOLD_TOGGLE_2: {
            actions: holdToggle(1),
          },
          HOLD_TOGGLE_3: {
            actions: holdToggle(2),
          },
          HOLD_TOGGLE_4: {
            actions: holdToggle(3),
          },
          HOLD_TOGGLE_5: {
            actions: holdToggle(4),
          },
          HOLD_1: {
            actions: holdCard(0),
          },
          HOLD_2: {
            actions: holdCard(1),
          },
          HOLD_3: {
            actions: holdCard(2),
          },
          HOLD_4: {
            actions: holdCard(3),
          },
          HOLD_5: {
            actions: holdCard(4),
          },
          HOLD_ALL: {
            actions: assign({
              holds: [true, true, true, true, true],
            }),
          },
          SCORE: {
            target: "loadingResults",
          },
        },
      },
      loadingResults: {
        invoke: {
          id: "getResult",
          src: (context, event) =>
            fetchResults(context.game_id, { Holds: context.holds }),
          onDone: {
            target: "draw",
            actions: assign({
              draw: (context, event) => event.data.Draw,
              result: (context, event) => event.data.Result,
              final_cards: (context, event) => event.data.FinalCards,
            }),
          },
          onError: {
            target: "failure",
          },
        },
      },
      draw: {
        on: {
          "": {
            target: "score",
            actions: assign({
              holds: [false, false, false, false, false],
              // result: (context, event) => Poker.Score(context.final_cards),
            }),
          },
        },
      },
      score: {
        on: {
          START: {
            target: "loadingGame",
          },
        },
      },
      failure: {},
    },
  })

export default pokerMachineFactory
