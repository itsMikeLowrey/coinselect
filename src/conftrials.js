function filterUtxos (utxos, minConfOwn, minConfOther, minConfCoinbase) {
  var used = []
  var unused = []

  for (var i = 0; i < utxos.length; i++) {
    var utxo = utxos[i]
    if (utxo.coinbase == null || utxo.own == null || utxo.confirmations == null) {
      console.log(utxo)
      throw new Error('Missing information.')
    }

    var isUsed

    if (utxo.coinbase) {
      isUsed = utxo.confirmations >= minConfCoinbase
    } else if (utxo.own) {
      isUsed = utxo.confirmations >= minConfOwn
    } else {
      isUsed = utxo.confirmations >= minConfOther
    }

    if (isUsed) {
      used.push(utxo)
    } else {
      unused.push(utxo)
    }
  }
  return {
    used: used,
    unused: unused
  }
}

module.exports = function confTrials (minConfCoinbase, algorithm) {
  return function (utxos, outputs, feeRate) {
    var trials = [
      [1, 6],
      [1, 5],
      [1, 4],
      [1, 3],
      [1, 2],
      [1, 1],
      [0, 1],
      [0, 0]
    ]

    var result = {}
    var unused = utxos
    var used = []

    for (var i = 0; i < trials.length; i++) {
      if (unused.length > 0) {
        var trial = trials[i]
        var filterResult = filterUtxos(unused, trial[0], trial[1], minConfCoinbase, utxos)
        if (filterResult.used.length > 0) {
          used = used.concat(filterResult.used)
          unused = filterResult.unused
          result = algorithm(used, outputs, feeRate)
          if (result.inputs) {
            return result
          }
        }
      }
    }

    return result
  }
}
