var accumulative = require('./inputs/accumulative')
var bnb = require('./inputs/bnb')
var score = require('./utxosort/score')
var utils = require('./utils')
var conftrials = require('./conftrials')

module.exports = function (inputs, outputs, feeRate) {
  var algorithm = utils.applySort(
    score.descending,
    conftrials(
      100,
      utils.algorithmBackup([bnb(0.5), accumulative])
    )
  )
  return algorithm(inputs, outputs, feeRate)
}
