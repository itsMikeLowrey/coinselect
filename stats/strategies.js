let accumulative = require('../src/inputs/accumulative')
let blackjack = require('../src/inputs/blackjack')
let valueSort = require('../src/utxosort/value')
let coinSelect = require('../src/')
let utils = require('../src/utils')

let shuffleImport = require('fisher-yates/inplace')
let shuffle = utxos => shuffleImport(utxos)

let blackmax = utils.applySort(valueSort.ascending, utils.algorithmBackup([blackjack, accumulative]))
let blackmin = utils.applySort(valueSort.descending, utils.algorithmBackup([blackjack, accumulative]))
let blackrand = utils.applySort(shuffle, utils.algorithmBackup([blackjack, accumulative]))

let maximal = utils.applySort(valueSort.ascending, accumulative)
let minimal = utils.applySort(valueSort.descending, accumulative)

let random = utils.applySort(shuffle, accumulative)

let bestof = utils.algorithmBest(Array(100).fill(utils.applySort(shuffle, accumulative)))

let FIFO = utils.applySort(utxos => utxos.reverse(), accumulative)

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
