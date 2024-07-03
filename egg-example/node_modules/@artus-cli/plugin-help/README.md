# @artus-cli/plugin-help

Built-in plugin for showing help information in artus-cli

[![NPM version](https://img.shields.io/npm/v/@artus-cli/plugin-help.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/plugin-help)
[![NPM quality](https://img.shields.io/npms-io/final-score/@artus-cli/plugin-help.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/plugin-help)
[![NPM download](https://img.shields.io/npm/dm/@artus-cli/plugin-help.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/plugin-help)
[![Continuous Integration](https://github.com/artus-cli/plugin-help/actions/workflows/ci.yml/badge.svg)](https://github.com/artus-cli/plugin-help/actions/workflows/ci.yml)
[![Test coverage](https://img.shields.io/codecov/c/github/artus-cli/plugin-help.svg?style=flat-square)](https://codecov.io/gh/artus-cli/plugin-help)
[![Oss Insight Analytics](https://img.shields.io/badge/OssInsight-artus--cli%2Fartus--cli-blue.svg?style=flat-square)](https://ossinsight.io/analyze/artus-cli/plugin-help)

## Install

```sh
$ npm i @artus-cli/plugin-help
```

## Usage

```ts
// plugin.ts

export default {
  help: {
    enable: true,
    package: '@artus-cli/plugin-help',
  },
};
```

## Contributing

```sh
$ npm test
$ npm run cov
```
