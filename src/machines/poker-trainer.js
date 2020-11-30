import { Machine, assign } from "xstate"

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

const fetchGame = context => {
  const { token, mode } = context
  // console.log("token", token)
  return fetch(`${GATSBY_API_URL}/play/${mode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(response => response.json())
  // .then(response => {
  //   console.log("FETCH", response.json())
  //   return response.json()
  // })
}
const fetchResults = context => {
  const { game_id, token, holds } = context
  // console.log("Doing a fetch", `${GATSBY_API_URL}/draw/${game_id}`)
  return fetch(`${GATSBY_API_URL}/draw/${game_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ Holds: holds }),
  }).then(response => response.json())
}
const pokerMachineFactory = (token, mode) =>
  Machine({
    initial: "idle",
    context: {
      token,
      mode,
      credits: "?",
      game_id: null,
      hand: null,
      draw: null,
      final_cards: null,
      holds: [false, false, false, false, false],
      result: null,
      strategy: null,
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
          src: (context, event) => fetchGame(context),
          onDone: {
            target: "active",
            actions: assign({
              result: null,
              draw: null,
              final_cards: null,
              strategy: (context, event) =>
                context.mode === "casual" ? event.data.Strategy : null,
              hand: (context, event) => event.data.Hand,
              credits: (context, event) => event.data.User.Credits,
              game_id: (context, event) => {
                // console.log("getPlay", event.data)
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
            actions: [
              holdToggle(0),
              (context, event) => {
                // console.log(event, "good")
              },
            ],
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
          SUGGEST: {
            actions: [
              // @todo does this even work? gaurd this if the mode isnt right
              (context, event) =>
                context.mode !== "casual" ? { target: "failure" } : null,
              assign({
                holds: (context, event) =>
                  ["1", "2", "3", "4", "5"].map(slot =>
                    context.strategy.strategy.indexOf(`HOLD_${slot}`) !== -1
                      ? true
                      : false
                  ),
              }),
            ],
          },
          SCORE: {
            target: "loadingResults",
          },
        },
      },
      loadingResults: {
        invoke: {
          id: "getResult",
          src: (context, event) => fetchResults(context),
          onDone: {
            target: "draw",
            actions: assign({
              draw: (context, event) => event.data.Draw,
              strategy: (context, event) => event.data.Strategy,
              // strategy: (context, event) =>
              //   context.mode !== "casual" ? event.data.Strategy : context.strategy,
              result: (context, event) => event.data.Result,
              credits: (context, event) => event.data.User.Credits,
              final_cards: (context, event) => event.data.FinalCards,
            }),
          },
          onError: {
            target: "failure",
          },
        },
      },
      draw: {
        always: {
          target: "score",
          actions: assign({
            holds: [false, false, false, false, false],
            // result: (context, event) => Poker.Score(context.final_cards),
          }),
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