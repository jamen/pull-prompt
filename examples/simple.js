var pull = require('pull-stream')
var { values, drain } = pull
var prompt = require('../')

const colors = [
    {title: 'red',    value: '#f00'},
    {title: 'yellow', value: '#ff0'},
    {title: 'green',  value: '#0f0'},
    {title: 'blue',   value: '#00f'},
    {title: 'black',  value: '#000'},
    {title: 'white',  value: '#fff'}
]
const suggestColors = (input) => Promise.resolve(colors
    .filter((color) => color.title.slice(0, input.length) === input))

pull(
  values([
    { type: 'text', message: 'Hello world', default: 'test' },
    { type: 'confirm', message: 'Kek' },
    { type: 'autocomplete', message: 'Hello world', suggest: suggestColors }
  ]),
  prompt(),
  drain(answer => {
    console.log(answer)
  }, err => {
    if (err) throw err
    console.log('finished')
  })
)
