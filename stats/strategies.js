let accumulative = require('../src/inputs/accumulative')
let blackjack = require('../src/inputs/blackjack')
let valueSort = require('../src/utxosort/value')
let privetSort = require('../src/utxosort/privet')
let blackminScore = require('../src/blackminscore')
let bnb = require('../src/')
let utils = require('../src/utils')

let shuffleImport = require('fisher-yates/inplace')
let shuffle = utxos => shuffleImport(utxos)

let blackmax = utils.applySort(valueSort.ascending, utils.algorithmBackup([blackjack, accumulative]))
let blackmin = utils.applySort(valueSort.descending, utils.algorithmBackup([blackjack, accumulative]))
let blackrand = utils.applySort(shuffle, utils.algorithmBackup([blackjack, accumulative]))

let maximal = utils.applySort(valueSort.ascending, accumulative)
let minimal = utils.applySort(valueSort.descending, accumulative)

let privet = utils.applySort(privetSort, accumulative)

let random = utils.applySort(shuffle, accumulative)

let bestof = utils.algorithmBest(Array(100).fill(utils.applySort(shuffle, accumulative)))

let FIFO = utils.applySort(utxos => utxos.reverse(), accumulative)

module.exports = {
  accumulative,
  bestof,
  bnb,
  blackjack,
  blackmax,
  blackmin,
  blackrand,
  blackminScore,
  FIFO,
  maximal,
  minimal,
  privet,
  random
}
