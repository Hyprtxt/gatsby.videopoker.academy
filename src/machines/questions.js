import { Machine, assign } from "xstate"

const questionsMachine = createMachine({
    id: 'questions',
    initial: 'inactive',
    context: {

    }
    states: {
      toLearn: { on: { PLAY: 'forFun', LEARN: 'link_learn' } },
      forFun: { on: { FUN: 'wantHelp', MONEY: 'link_learn' } },
      online: { on: { ONLINE: '', OFFLINE: '' } },
      trainer_mode: {},
      link_learn: {}
    }
  });