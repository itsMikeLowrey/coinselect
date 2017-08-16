var utils = require('../utils')

// order by descending value, minus the inputs approximate fee
function utxoScore (x, feeRate) {
  return x.value - (feeRate * utils.inputBytes(x))
}

module.exports = {
  ascending: sort('ascending'),
  descending: sort('descending')
}

function sort (type) {
  return function (feeRate) {
    return function (utxos) {
      return utxos.concat().sort(function (a, b) {
        return utxoScore(b, feeRate) - utxoScore(a, feeRate)
      })
    }
  }
}
