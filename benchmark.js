const execSync = require('child_process').execSync
const path = require('path')
const {performance} = require('perf_hooks')

const RUNS_COUNT = 10

function install(cwd) {
  execSync(`npm i`, {
    cwd,
    encoding: 'utf-8',
  })
}

function build(cwd) {
  execSync(`node --cpu-prof node_modules/webpack-cli/bin/cli.js -c ../webpack.config.js`, {
    cwd,
    encoding: 'utf-8',
  })
}

function pushResult(res, runName, runTime) {
  res[runName] = res[runName] || []
  res[runName].push(runTime)
}

const testData = [
  {
    name: 'webpack 4',
    init: () => install(path.join(__dirname, 'webpack4')),
    cmd: () => build(path.join(__dirname, 'webpack4'))
  },
  {
    name: 'webpack 5',
    init: () => install(path.join(__dirname, 'webpack5')),
    cmd: () => build(path.join(__dirname, 'webpack5'))
  },
]

function run(data) {
  const res = {}
  data.forEach(d => {
    d.init()
    for (let i = 0; i < RUNS_COUNT; i++) {
      const startTime = performance.now()
      d.cmd()
      const t = performance.now() - startTime
      pushResult(res, d.name, t)
      console.log(d.name + ' (' + i + ') : ' + t / 1000 + ' seconds\n')
    }
  })
  return res
}



function printResult(results) {
  let humanRes = ''
  Object.keys(results).forEach(k => {
    const times = results[k]
    const mean = (times.reduce((s, t) => s + t, 0) / times.length) / 1000 // seconds

    humanRes += k + ': ' + mean + ' seconds\n'
  })
  let fs = require('fs');
  fs.writeFileSync('bench.json', JSON.stringify(results, null, 2), 'utf-8')
  fs.writeFileSync('bench.human.txt', humanRes, 'utf-8')
  console.log(humanRes)
}

printResult(run(testData))
