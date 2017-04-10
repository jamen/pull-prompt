# pull-prompt

> A CLI prompter for pull-streams

A [pull-stream](https://github.com/pull-stream/pull-stream) that maps questions to answers by prompting the user.  It relies on [`prompt-skeleton`](https://npmjs.com/prompt-skeleton) ecosystem.

```js
pull(
  values([
    { type: 'text',
      message: 'what is the first animal you think of?',
      default: 'unicorn' },
    { type: 'confirm',
      message: 'is the animal awesome?',
      default: true }
  ]),
  prompt(),
  collect((err, answers) => {
    // ...
  })
)
```

See [`examples/`](examples/) for use with state management modules (like [`pull-stream-model`](https://npmjs.com/pull-stream-model) and [`redux`](https://npmjs.com/redux)).

## Installation

```sh
# with npm
npm i -s pull-prompt

# with yarn
yarn add pull-prompt
```

## Usage

### `prompt()`

A [through stream](https://github.com/pull-stream/pull-stream#through) that maps [questions](#questions) to what the user inputs.

```js
pull(
  questions(),
  prompt(),
  collect((err, answers) => {
    // ...
  })
)
```

### Questions

Questions are objects which have a minimum of `{ type, message }`.  They may contain extra properties from the prompt type (e.g. `default`, `suggest`) or the user (e.g. `name: 'license'`)

### `'text'` question

```js
{
  type: 'text',
  message: 'What is your name?',
  default: 'John Doe' // optional
}
```

### `'confirm'` question

```js
{
  type: 'confirm',
  message: 'Do you agree to the terms?',
  default: false, // optional
}
```

### `'autocomplete'` question

```js
{
  type: 'autocomplete',
  message: 'What country do you live in?',
  suggest: function (input) {
    // ...
  }
}
```

The `suggest` function returns `Promise<Array>`. See [`cli-autocomplete`](https://github.com/derhuerst/cli-autocomplete) for more info

---

_Maintained by [Jamen Marz](https://git.io/jamen) (See on [Twitter](https://twitter.com/jamenmarz) and [GitHub](https://github.com/jamen) for questions & updates)_
