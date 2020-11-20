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

const fetchGame = () =>
  fetch(`http://localhost:1337/play`, {
    method: "POST",
  }).then(response => response.json())

const fetchResults = (game_id, data) => {
  console.log("Doing a fetch", `http://localhost:1337/draw/${game_id}`)
  return fetch(`http://localhost:1337/draw/${game_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(response => response.json())
}

const pokerMachine = () =>
  Machine({
    initial: "idle",
    context: {
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
          src: (context, event) => fetchGame(),
          onDone: {
            target: "active",
            actions: assign({
              draw: null,
              final_cards: null,
              hand: (context, event) => event.data.Hand,
              game_id: (context, event) => event.data.id,
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

export default pokerMachine
