var utils = require('../utils')

module.exports = function (utxos, feeRate) {
  let txosMap = {}
  utxos.forEach(function (txo) {
    if (!txosMap[txo.address]) {
      txosMap[txo.address] = []
    }

    txosMap[txo.address].push(txo)
  })
  // order & summate sets
  for (var address in txosMap) {
    txosMap[address] = txosMap[address].sort(function (a, b) {
      return utils.utxoScore(b, feeRate) - utils.utxoScore(a, feeRate)
    })
    txosMap[address].value = txosMap[address].reduce(function (a, x) {
      return a + x.value
    }, 0)
  }

  utxos = [].concat.apply([], Object.keys(txosMap).sort(function (ak, bk) {
    return txosMap[bk].value - txosMap[ak].value
  }).map(function (x) {
    return txosMap[x]
  }))
  return utxos
}
