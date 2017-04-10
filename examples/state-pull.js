var pull = require('pull-stream')
var app = require('pull-stream-model')
var notify = require('pull-notify')
var prompt = require('../')
var chalk = require('chalk')

var game = app(Object.assign(() => ({
    player:
      { x: 0, y: 0, facing: 'north',
      inventory: [ { name: 'kek', worth: Infinity } ] },
    world:
      [ { name: 'test', x: 2, y: 3, worth: 0, pick_up: true } ]
}), {
  update: {
    move: function (state, direction) {
      var unknown = false
      switch (direction) {
        case 'north': state.player.y++; break
        case 'south': state.player.y--; break
        case 'east': state.player.x++; break
        case 'west': state.player.x--; break
        default: unknown = true; break
      }
      if (!unknown) state.player.facing = direction
      return state
    },

    face: function (state, direction) {
      switch (direction) {
        case 'north':
        case 'south':
        case 'east':
        case 'west': {
          state.player.facing = direction
          break
        }
        default: {
          say(`i dont know which way ${direction} is`);
          break
        }
      }
      return state
    },

    pick_up: function (state) {
      var area_x = state.player.x
      var area_y = state.player.y
      switch (state.player.facing) {
        case 'north': area_y++; break
        case 'south': area_y--; break
        case 'east': area_x++; break
        case 'west': area_x--; break
      }

      var world = state.world
      for (var i = world.length; i--;) {
        var item = world[i]
        if (item.x === area_x && item.y === area_y) break
        if (item.x === state.player.x && item.y === state.player.y) break
      }

      if (i > -1) {
        var [item] = state.world.splice(i, 1)
        state.player.inventory.push(item)
        say(`i got ${item.name}`)
      } else {
        say(`nothing to pick up??`)
      }
      return state
    },

    unknown: function (state, msg_name) {
      say(`i dont know how to "${msg_name}"`)
      return state
    },

    none: function (state) {
      say(`you didn't say anything`)
      return state
    }
  }
}))

function say (message) {
  console.log(chalk.gray('Me:') + ' ' + message)
}

function validate (msg) {
  var messages = Object.keys(game.msg)
  if (msg[0] === '') {
    return ['none']
  } else if (messages.indexOf(msg[0]) === -1) {
    return ['unknown', msg[0]]
  } else {
    return msg
  }
}

var questions = notify()

function ask () {
  questions({ type: 'text', message: 'do' })
}

pull(
  questions.listen(),
  prompt(),
  pull.map(x => x.split(' ')),
  pull.map(validate),
  game.store,
  pull.drain(state => {
    console.log(state)
    ask()
  }, err => {
    if (err) throw err
    console.log('finished')
  })
)

ask()
