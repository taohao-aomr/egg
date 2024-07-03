# artus-cli/plugin-autocomplete

autocomplete plugin for artus-cli

[![NPM version](https://img.shields.io/npm/v/@artus-cli/plugin-autocomplete.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/plugin-autocomplete)
[![NPM quality](https://img.shields.io/npms-io/final-score/@artus-cli/plugin-autocomplete.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/plugin-autocomplete)
[![NPM download](https://img.shields.io/npm/dm/@artus-cli/plugin-autocomplete.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/plugin-autocomplete)
[![Continuous Integration](https://github.com/plugin-autocomplete/plugin-autocomplete/actions/workflows/ci.yml/badge.svg)](https://github.com/plugin-autocomplete/plugin-autocomplete/actions/workflows/ci.yml)
[![Test coverage](https://img.shields.io/codecov/c/github/plugin-autocomplete/plugin-autocomplete.svg?style=flat-square)](https://codecov.io/gh/plugin-autocomplete/plugin-autocomplete)
[![Oss Insight Analytics](https://img.shields.io/badge/OssInsight-artus--cli%2Fartus--cli-blue.svg?style=flat-square)](https://ossinsight.io/analyze/plugin-autocomplete/plugin-autocomplete)


## Install

```sh
$ npm i @artus-cli/plugin-autocomplete 
```

## Usage

```ts
// plugin.ts

export default {
  autocomplete: {
    enable: true,
    package: 'artus-cli/plugin-autocomplete',
  },
};
```

## Commands

### autocomplete

```bash
$ my-bin autocomplete zsh
```

## Contributing

```sh
$ npm test
$ npm run cov
```
