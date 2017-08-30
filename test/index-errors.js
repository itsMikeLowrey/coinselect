var coinAccum = require('../src/index')
var fixtures = require('./fixtures/index-errors.json')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputLength = f.inputLength
    var outputLength = f.outputLength

    var inputs = utils.expand(f.inputs, true, inputLength)
    var outputs = utils.expand(f.outputs, false, outputLength)
    var expected = f.expected;

    t.throws(function() {
      coinAccum(inputs, outputs, f.feeRate, {inputLength: inputLength, outputLength: outputLength})
    }, new RegExp(f.expected));

    t.end()
  })
})
