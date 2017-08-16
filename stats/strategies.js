let accumulative = require('../src/inputs/accumulative')
let blackjack = require('../src/inputs/blackjack')
let valueSort = require('../src/utxosort/value')
let coinSelect = require('../src/')
let utils = require('../src/utils')

let shuffleImport = require('fisher-yates/inplace')
let shuffle = utxos => shuffleImport(utxos)

var blackmax = utils.applySort(valueSort.ascending, utils.algorithmBackup([blackjack, accumulative]))
var blackmin = utils.applySort(valueSort.descending, utils.algorithmBackup([blackjack, accumulative]))
var blackrand = utils.applySort(shuffle, utils.algorithmBackup([blackjack, accumulative]))

var maximal = utils.applySort(valueSort.ascending, accumulative)
var minimal = utils.applySort(valueSort.descending, accumulative)

var random = utils.applySort(shuffle, accumulative)

var bestof = utils.algorithmBest(Array(100).fill(utils.applySort(shuffle, accumulative)))

// This is impossible with utils.applySort
// Also I fail to see diff between this and maximal
function proximal (utxos, outputs, feeRate) {
  const outAccum = outputs.reduce((a, x) => a + x.value, 0)

  utxos = utxos.concat().sort((a, b) => {
    let aa = a.value - outAccum
    let bb = b.value - outAccum

    return aa - bb
  })

  return accumulative(utxos, outputs, feeRate)
}

function reverse (utxos) {
  return utxos.concat().reverse()
}

var FIFO = utils.applySort(reverse, accumulative)

module.exports = {
  accumulative,
  bestof,
  blackjack,
  blackmax,
  blackmin,
  blackrand,
  coinSelect,
  FIFO,
  maximal,
  minimal,
  // privet
  // Privet removed - couldn't figure out the point :(
  proximal,
  random
}
