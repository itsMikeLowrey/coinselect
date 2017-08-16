var accumulative = require('./inputs/accumulative')
var blackjack = require('./inputs/blackjack')
var score = require('./utxosort/score')
var utils = require('./utils')

module.exports = function (inputs, outputs, feeRate) {
  var algorithm = utils.applySort(score.descending, utils.algorithmBackup([blackjack, accumulative]))
  return algorithm(inputs, outputs, feeRate)
}
