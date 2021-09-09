'use strict'

module.exports = {
  root: true,
  globals: {
    browser: true
  },
  env: {
    node: true,
    jest: true
  },
  extends: [
    '@antfu/eslint-config-ts',
    'plugin:prettier/recommended',
    'prettier'
  ],
  rules: {}
}
