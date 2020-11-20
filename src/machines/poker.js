import { Machine, assign } from "xstate"
import Poker from "../poker"

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

const fetchGame = () => {
  console.log("Doing a fetch")
  return fetch(`http://localhost:1337/play`, {
    method: "POST",
  }).then(response => response.json())
}

const pokerMachine = () =>
  Machine({
    initial: "idle",
    context: {
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
          src: (context, event) => fetchGame(),
          onDone: {
            target: "active",
            actions: assign({
              hand: (context, event) => event.data.Hand,
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
            // target: "loadingResults",
            target: "draw",
          },
        },
      },
      // loadingResults: {
      //   on: {
      //     COMPLETE: {
      //       target: "draw",
      //       actions: assign({
      //         final_cards: (context, event) => {
      //           const { hand, draw } = context
      //           return context.holds.map((hold, index) =>
      //             hold ? hand[index] : draw.splice(0, 1)[0]
      //           )
      //         },
      //       }),
      //     },
      //   },
      // },
      draw: {
        on: {
          "": {
            // target: "score",
            target: "idle",
            actions: assign({
              result: (context, event) => Poker.Score(context.final_cards),
            }),
          },
        },
      },
      score: {},
      failure: {},
    },
  })

export default pokerMachine
