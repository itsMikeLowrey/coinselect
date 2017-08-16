var coinSelect = require('../src/blackminscore')
var fixtures = require('./fixtures/blackminscore')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputs = utils.expand(f.inputs, true)
    var outputs = utils.expand(f.outputs)
    var actual = coinSelect(inputs, outputs, f.feeRate)

    t.same(actual, f.expected)
    if (actual.inputs) {
      var feedback = coinSelect(actual.inputs, actual.outputs, f.feeRate)
      t.same(feedback, f.expected)
    }

    t.end()
  })
})
