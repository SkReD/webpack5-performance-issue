# Webpack 5 test repo

This repo shows performance degradation of build in production for webpack5 comparing to webpack4

source code is based on https://github.com/meskill/webpack5-performance-issue to simulate some real world example

## How to reproduce

1. Clone this repo
2. Run `node benchmark.js`
3. Profiles outputted to webpack4/webpack5 directories and bench results outputted to bench.json, bench.human.txt
