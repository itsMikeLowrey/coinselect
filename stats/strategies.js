let accumulative = require('../src/inputs/accumulative')
let blackjack = require('../src/inputs/blackjack')
let bnb = require('../src/')
let utils = require('../src/utils')
let sorts = require('../src/sorts')

let shuffleImport = require('fisher-yates')
let shuffle = utxos => shuffleImport(utxos)

function applyCompare(compare, algorithm) {
  return applySort(inputs => inputs.concat().sort(compare), algorithm)
}

function applySort(sort, algorithm) {
  return (inputs, outputs, feeRate) =>
    algorithm(sort(inputs, feeRate), outputs, feeRate)
}

let blackmax = applyCompare(sorts.value(sorts.DESCENDING), utils.anyOf([blackjack, accumulative]))
let blackmin = applyCompare(sorts.value(sorts.DESCENDING), utils.anyOf([blackjack, accumulative]))
let maximal = applyCompare(sorts.value(sorts.DESCENDING), accumulative)
let minimal = applyCompare(sorts.value(sorts.ASCENDING), accumulative)

let blackrand = applySort(shuffle, utils.anyOf([blackjack, accumulative]))
let random = applySort(shuffle, accumulative)

let bestof = utils.bestOf(Array(100).fill(applySort(shuffle, accumulative)))
let FIFO = applySort(utxos => utxos.concat().reverse(), accumulative)

function privetSort(utxos, feeRate) {
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

let privet = applySort(privetSort, accumulative)

module.exports = {
  accumulative,
  bestof,
  bnb,
  blackjack,
  blackmax,
  blackmin,
  blackrand,
  FIFO,
  maximal,
  minimal,
  privet,
  random
}
