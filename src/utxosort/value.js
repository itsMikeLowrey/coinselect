module.exports = {
  ascending: sort('ascending'),
  descending: sort('descending')
}

function sort (type) {
  return function value (utxos, feeRate) {
    return utxos.concat().sort(function (a, b) {
      var difference = a.value - b.value
      return type === 'ascending' ? difference : -difference
    })
  }
}
