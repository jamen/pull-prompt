var asyncMap = require('pull-stream').asyncMap
var chalk = require('chalk')
var textPrompt = require('text-prompt')
var autoPrompt = require('cli-autocomplete')
var yn = require('yn')

module.exports = prompt

function prompt () {
  return asyncMap(function resolve (question, done) {
    if (!question || !question.type) done(null, null)
    switch (question.type) {
      case 'text': return text(question, done)
      case 'confirm': return confirm(question, done)
      case 'autocomplete': return autocomplete(question, done)
      default: return done(null, null)
    }
  })
}

function text ({ message, default: def }, done) {
  if (def !== undefined)
    message += ' ' + chalk.grey('(' + def + ')')

  textPrompt(message).on('submit', answer => {
    if (answer === '' && def) done(null, def)
    else done(null, answer)
  })
}

function confirm (question, done) {
  var { message, default: def } = question
  var def_message =  def !== undefined ? def ? 'Y/n' : 'y/N' : 'y/n'
  message += ' ' + chalk.grey('(' + def_message + ')')

  textPrompt(message).on('submit', answer => {
    answer = yn(answer)
    if (answer === null) {
      if (def !== undefined) done(null, def)
      else confirm(question, done)
    }
    else done(null, answer)
  })
}

function autocomplete ({ message, suggest }, done) {
  return autoPrompt(message, suggest).on('submit', answer => done(null, answer))
}
