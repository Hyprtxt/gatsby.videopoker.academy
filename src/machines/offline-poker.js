import { Machine, assign } from "xstate"
import Poker from "../poker"

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

const pokerMachine = () =>
  Machine({
    initial: "idle",
    context: {
      // mode: "offline",
      deck: getNewCards(),
      hand: null,
      final_cards: null,
      holds: [false, false, false, false, false],
      result: null,
    },
    states: {
      idle: {
        on: {
          START: {
            target: "active",
            actions: assign({
              hand: (context, event) => {
                // console.log("DRAWCARDS")
                return [...context.deck.splice(0, 5)]
              },
            }),
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
        on: {
          "": {
            target: "score",
            actions: assign({
              result: (context, event) => Poker.Score(context.final_cards),
            }),
          },
        },
      },
      score: {},
    },
  })

export default pokerMachine
