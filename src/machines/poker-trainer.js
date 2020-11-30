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
const pokerMachineFactory = token =>
  Machine(
    {
      initial: "idle",
      context: {
        token,
        mode: "trainer",
        streak: 0,
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
                strategy: null,
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
            CHECK: {
              target: "loadingResults",
            },
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
          },
        },
        loadingResults: {
          invoke: {
            id: "getResult",
            src: (context, event) => fetchResults(context),
            onDone: {
              target: "processResults",
              actions: assign({
                draw: (context, event) => event.data.Draw,
                strategy: (context, event) => event.data.Strategy,
                result: (context, event) => event.data.Result,
                final_cards: (context, event) => event.data.FinalCards,
                // streak
              }),
            },
            onError: {
              target: "failure",
            },
          },
        },
        processResults: {
          always: [
            {
              target: "addToStreak",
              cond: "didPlayerMatchStrategy",
            },
            { target: "gameOver" },
          ],
        },
        addToStreak: {
          always: {
            target: "result",
            actions: assign({
              streak: (context, event) => context.streak + 1,
            }),
          },
        },
        result: {
          on: {
            START: {
              target: "loadingGame",
              actions: assign({
                holds: [false, false, false, false, false],
              }),
            },
          },
        },
        gameOver: { type: "final" },
        failure: {},
      },
    },
    {
      guards: {
        didPlayerMatchStrategy: (context, event) =>
          JSON.stringify(
            context.holds
              .map((isHold, index) => (isHold ? `HOLD_${index + 1}` : null))
              // .filter(🙂 => 🙂),
              .filter(x => x),
            null,
            0
          ) === JSON.stringify(context.strategy.strategy, null, 0),
      },
    }
  )

export default pokerMachineFactory
