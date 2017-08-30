var coinAccum = require('../src/inputs/bnb')
var fixtures = require('./fixtures/bnb')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputLength = f.inputLength
    var outputLength = f.outputLength
    var factor = f.factor

    var inputs = utils.expand(f.inputs, true, inputLength)
    var outputs = utils.expand(f.outputs, false, outputLength)
    var expected = utils.addScriptLengthToExpected(f.expected, inputLength, outputLength)

    var actual = coinAccum(f.factor)(inputs, outputs, f.feeRate, inputLength, outputLength)

    t.same(actual, expected)
    if (actual.inputs) {
      var feedback = coinAccum(f.factor)(actual.inputs, actual.outputs, f.feeRate, inputLength, outputLength)
      t.same(feedback, expected)
    }

    t.end()
  })
})
