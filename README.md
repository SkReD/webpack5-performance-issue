# Webpack 5 test repo

This repo shows cache reusing problem in webpack 5 when configuration is same and only entry differs

source code is based on https://github.com/meskill/webpack5-performance-issue to simulate some real world example

## How to reproduce

1. Clone this repo
2. Run `node benchmark.js`
3. Results will be in console and in output files bench.*
