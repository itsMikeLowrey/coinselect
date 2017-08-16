module.exports = {
  ascending: sort('ascending'),
  descending: sort('descending')
}

function sort (type) {
  return function value (utxos) {
    return utxos.sort(function (a, b) {
      var difference = a.value - b.value
      return type === 'ascending' ? difference : -difference
    })
  }
}
