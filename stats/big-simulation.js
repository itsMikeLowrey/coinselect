let Simulation = require('./simulation')
let modules = require('./strategies')
let min = 14226 // 0.1 USD
let max = 142251558 // 1000 USD
let feeRate = 56 * 100
let results = []

let list = require('./moneypot-hotwallet.json');

// for each strategy
for (var name in modules) {
  let f = modules[name]
  let simulation = new Simulation(name, f, feeRate)

  console.log(name)
  let i = 0
  for (var value of list) {
    i++
    
    if (i%1000 == 0) {
      console.log(i)
    }
    let txo = {
      address: 'A',
      value: Math.abs(value)
    }

    if (value > 0) {
      simulation.addUTXO(txo) 
    } else {
      simulation.run([txo])
    }
  }

  simulation.finish()
  results.push(simulation)
}

Simulation.printResults(results);

