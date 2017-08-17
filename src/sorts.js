var utils = require('./utils')

var ASCENDING = 'ascending'
var DESCENDING = 'descending'

function score (type, feeRate) {
  return function (a, b) {
    var difference = utils.utxoScore(a, feeRate) - utils.utxoScore(b, feeRate)
    return type === ASCENDING ? difference : -difference
  }
}

function value (type) {
  return function (a, b) {
    var difference = a.value - b.value
    return type === ASCENDING ? difference : -difference
  }
}

module.exports = {
  score: score,
  value: value,
  ASCENDING: ASCENDING,
  DESCENDING: DESCENDING
}
