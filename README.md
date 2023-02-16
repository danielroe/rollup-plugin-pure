# `rollup-plugin-pure`

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> Automatically add `/* #__PURE__ */` annotations before definition functions

- [✨ &nbsp;Changelog](https://github.com/danielroe/rollup-plugin-pure/blob/main/CHANGELOG.md)
- [▶️ &nbsp;Online playground](https://stackblitz.com/github/danielroe/rollup-plugin-pure/tree/main/playground)

## Features

- ⚡️ avoids end-users bundling unused code

## How it works

Definition functions (for example, in Vue with `defineComponent`) are increasingly common but do not play nice with tree-shaking. It's not possible to tell whether or not a function call which receives an object can be tree-shaken from a build, as it's possible there might be side effects.

Rollup supports `/* #__PURE__ */` annotations to declare this from a library author's point of view, but it can be tricky when we know that _every_ occurrence of a function call is pure.

This plugin will automatically inject the annotation before any occurrence of the function call.

## Installation

Install and add `rollup-plugin-pure` to your Vite or Rollup config.

```bash
pnpm add -D rollup-plugin-pure
```

```js
import { defineConfig } from 'vite'
import { PluginPure } from 'rollup-plugin-pure'

export default defineConfig({
  plugins: [
    PluginPure({
      functions: ['defineComponent'],
      include: [/(?<!im)pure\.js$/],
      // exclude: [],
      // sourcemap: true,
    }),
  ],
})
```

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
- Install dependencies using `pnpm install`
- Stub module with `pnpm dev:prepare`
- Run `pnpm dev` to start [playground](./playground) in development mode

## License

Made with ❤️

Published under the [MIT License](./LICENCE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/rollup-plugin-pure?style=flat-square
[npm-version-href]: https://npmjs.com/package/rollup-plugin-pure
[npm-downloads-src]: https://img.shields.io/npm/dm/rollup-plugin-pure?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/rollup-plugin-pure
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/danielroe/rollup-plugin-pure/ci.yml?branch=main
[github-actions-href]: https://github.com/danielroe/rollup-plugin-pure/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/danielroe/rollup-plugin-pure/main?style=flat-square
[codecov-href]: https://codecov.io/gh/danielroe/rollup-plugin-pure
