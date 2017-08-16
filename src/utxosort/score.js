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
  return function (utxos, feeRate) {
    return utxos.concat().sort(function (a, b) {
      var difference = utxoScore(a, feeRate) - utxoScore(b, feeRate)
      return type === 'ascending' ? difference : -difference
    })
  }
}
