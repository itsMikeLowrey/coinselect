var utils = require('./utils')
var accumulative = require('./accumulative')
var shuffle = require('fisher-yates')

var maxTries = 1000000

function createLookahead (utxosSorted, feeRate) {
  var lookaheadList = []

  if (utxosSorted.length > 0) {
    var sumOfTail = 0
    for (var i = utxosSorted.length - 1; i >= 0; i--) {
      var input = utxosSorted[i]
      var effValue = input.value - utils.inputBytes(input) * feeRate
      if (effValue > 0) {
        sumOfTail = sumOfTail + effValue
      }
      lookaheadList.shift(sumOfTail)
    }
  }
  return lookaheadList
}

module.exports = function blackjack (utxos, outputs, feeRate) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}

  var extraCostForChange = (utils.inputBytes({}) + utils.outputBytes({})) * feeRate
  var costPerInput = utils.inputBytes({}) * feeRate

  var lastIncluded = -1

  var outAccum = utils.sumOrNaN(outputs)

  var remainingValueToSelect = outAccum + utils.transactionBytes([], outputs) * feeRate

  var utxosSorted = utxos.concat().sort(function (a, b) {
    return b.value - a.value
  })

  var lookahead = createLookahead(utxosSorted)

  var selectedUtxo = utxos.map(function () {
    return false
  })

  var branchAndBoundTries = maxTries
  var depth = 0

  if (branchAndBound()) {
    var inputs = []
    for (var i = 0; i <= lastIncluded; i++) {
      if (selectedUtxo[i]) {
        inputs.push(utxos[i])
      }
    }
    return utils.finalize(inputs, outputs, feeRate)
  } else {
    // fallback to random
    utxos = shuffle(utxos)
    return accumulative(utxos, outputs, feeRate)
  }

  function branchAndBound () {
    while (true) {
      branchAndBoundTries -= 1
      if (remainingValueToSelect + extraCostForChange < 0) {
        // Cut: Selected more than target plus cost for change.
        remainingValueToSelect = remainingValueToSelect + utxosSorted[lastIncluded].value - costPerInput
        selectedUtxo[lastIncluded] = false
        depth = lastIncluded + 1
        while (lastIncluded >= 0 && !(selectedUtxo[lastIncluded])) {
          lastIncluded -= 1
        }
      } else if (remainingValueToSelect <= 0) {
        return true
      } else if (branchAndBoundTries <= 0) {
        return false
      } else if (depth >= utxosSorted.length) {
        if (lastIncluded < 0) {
          return false
        }
        remainingValueToSelect = remainingValueToSelect + utxosSorted[lastIncluded].value - costPerInput
        selectedUtxo[lastIncluded] = false
        depth = lastIncluded + 1
        while (lastIncluded >= 0 && !(selectedUtxo[lastIncluded])) {
          lastIncluded -= 1
        }
      } else if (remainingValueToSelect > lookahead[depth]) {
        if (lastIncluded < 0) {
          return false
        }
        remainingValueToSelect = remainingValueToSelect + utxosSorted[lastIncluded].value - costPerInput
        selectedUtxo[lastIncluded] = false
        depth = lastIncluded + 1
        while (lastIncluded >= 0 && !(selectedUtxo[lastIncluded])) {
          lastIncluded -= 1
          if (lastIncluded < 0) {
            return false
          }
        }
      } else {
        remainingValueToSelect = remainingValueToSelect - utxosSorted[depth].value + costPerInput
        selectedUtxo[depth] = true
        lastIncluded = depth
        depth += 1
      }
    }
  }
}
