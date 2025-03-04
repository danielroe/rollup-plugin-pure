import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { rollup } from 'rollup'
import { bench, describe, expect } from 'vitest'
import { PluginPure } from '../src'

describe('pure annotation plugin', async () => {
  const code = await readFile(fileURLToPath(new URL('../playground/src/pure.js', import.meta.url)), 'utf-8')
  bench('basic transform', async () => {
    const transformed = await transform(code)
    expect(transformed).toContain('/*@__NO_SIDE_EFFECTS__*/ function defineComponent(options) {')
  })
})

async function transform(code: string) {
  const filename = 'index.ts'
  const bundle = await rollup({
    input: filename,
    plugins: [
      {
        name: 'entry',
        resolveId: id => (id === filename) ? id : undefined,
        load: id => id === filename ? code : undefined,
      },
      PluginPure({
        functions: ['defineComponent', '$createConfig', 'hashStyleFunction'],
        include: [/index\.ts/],
      }),
    ],
  })
  const { output } = await bundle.generate({})
  return output[0].code
}
