import { Machine, assign } from "xstate"
import Poker from "src/poker"

const suits = ["♦", "♣", "♥", "♠"],
  values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"],
  setupCards = array => {
    for (let suit_index = 0; suit_index < suits.length; suit_index++) {
      for (let value_index = 0; value_index < values.length; value_index++) {
        array.push(suits[suit_index] + values[value_index])
      }
    }
    return array
  },
  // http://bost.ocks.org/mike/shuffle/
  shuffle = array => {
    var counter = array.length,
      temp,
      index
    while (counter > 0) {
      index = (Math.random() * counter--) | 0
      temp = array[counter]
      array[counter] = array[index]
      array[index] = temp
    }
    return array
  },
  getNewCards = () => shuffle(setupCards([]))

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

const offlinePokerMachineFactory = credits =>
  Machine(
    {
      initial: "idle",
      context: {
        // mode: "offline",
        deck: getNewCards(),
        hand: null,
        final_cards: null,
        holds: [false, false, false, false, false],
        result: null,
        credits,
      },
      states: {
        idle: {
          on: {
            START: {
              target: "active",
              actions: "doStartGame",
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
              target: "draw",
              actions: assign({
                final_cards: (context, event) => {
                  let number_drawn = 0
                  const { hand, deck } = context
                  return context.holds.map((hold, index) =>
                    hold ? hand[index] : deck.splice(0, 1)[0]
                  )
                },
              }),
            },
          },
        },
        draw: {
          always: {
            target: "score",
            actions: assign({
              deck: () => getNewCards(),
              hand: null,
              holds: [false, false, false, false, false],
              result: null,
              credits: (context, event) => {
                const final =
                  context.credits + Poker.Score(context.final_cards).win
                window.localStorage.setItem("credits", final)
                return final
              },
              result: (context, event) => Poker.Score(context.final_cards),
            }),
          },
        },
        score: {
          on: {
            START: {
              target: "active",
              actions: "doStartGame",
            },
          },
        },
      },
    },
    {
      actions: {
        doStartGame: assign({
          final_cards: null,
          credits: (context, event) => {
            const final = context.credits - 5
            window.localStorage.setItem("credits", final)
            return final
          },
          hand: (context, event) => {
            // console.log("DRAWCARDS")
            return [...context.deck.splice(0, 5)]
          },
        }),
      },
    }
  )

export default offlinePokerMachineFactory
