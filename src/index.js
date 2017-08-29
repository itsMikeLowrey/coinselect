var accumulative = require('./inputs/accumulative')
var bnb = require('./inputs/bnb')
var sorts = require('./sorts')
var utils = require('./utils')
var tryConfirmed = require('./tryconfirmed')

module.exports = function (inputs, outputs, feeRate, options) {
  inputs = inputs.sort(sorts.score(sorts.DESCENDING, feeRate))

  var algorithm = tryConfirmed(
    utils.anyOf([bnb(0.5), accumulative]),
    options
  )

  return algorithm(inputs, outputs, feeRate, options.inputLength, options.outputLength)
}
