const execSync = require('child_process').execSync
const path = require('path')
const {performance} = require('perf_hooks')
const fsExtra = require('fs-extra')

const RUNS_COUNT = 1

function install(cwd) {
  execSync(`npm i`, {
    cwd,
    encoding: 'utf-8',
  })
}

function build(srcDir) {
  execSync(`node node_modules/webpack-cli/bin/cli.js -c ./webpack.config.js`, {
    cwd: process.cwd(),
    encoding: 'utf-8',
    stdio: 'inherit',
    env: {
      ...process.env,
      SRC_DIR: srcDir
    }
  })
}

function pushResult(res, runName, runTime) {
  res[runName] = res[runName] || []
  res[runName].push(runTime)
}

const testData = [
  {
    name: 'webpack 5 - 1',
    //beforeEach: () => require('fs-extra').removeSync(`${path.join(__dirname, 'webpack4')}/node_modules/.cache`),
    init: () => install(path.join(__dirname, 'webpack5-1')),
    cmd: () => build('webpack5-1')
  },
  {
    name: 'webpack 5 - 2',
    //beforeEach: () => require('fs-extra').removeSync(`${path.join(__dirname, 'webpack5')}/node_modules/.cache`),
    init: () => install(path.join(__dirname, 'webpack5-2')),
    cmd: () => build('webpack5-2')
  },
]

function run(data) {
  const res = {}

  fsExtra.removeSync('node_modules/.cache')

  data.forEach((d, i) => {
    d.init()

    if (i === 0) {
      const startTime = performance.now()
      d.cmd()
      const t = performance.now() - startTime
      console.log(d.name + ' (warmup) : ' + t / 1000 + ' seconds\n')
    }

    for (let i = 0; i < RUNS_COUNT; i++) {
      d.beforeEach?.()
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
