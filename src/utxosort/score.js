var utils = require('../utils')

module.exports = {
  ascending: sort('ascending'),
  descending: sort('descending')
}

function sort (type) {
  return function (utxos, feeRate) {
    return utxos.sort(function (a, b) {
      var difference = utils.utxoScore(a, feeRate) - utils.utxoScore(b, feeRate)
      return type === 'ascending' ? difference : -difference
    })
  }
}
