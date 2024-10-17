import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { execaCommand } from 'execa'
import { join } from 'pathe'
import { describe, expect, it } from 'vitest'

describe('pure annotation', () => {
  it('e2e', async () => {
    const assetsDir = fileURLToPath(new URL('../playground/dist/assets', import.meta.url))
    await $`pnpm vite build playground`
    const filename = await readdir(assetsDir).then(files => files.find(f => f.endsWith('.js')))
    // @ts-expect-error there must be a file or we _want_ a test failure
    const code = await readFile(join(assetsDir, filename), 'utf-8')
    expect(code).toContain('this should be in final bundle')
    expect(code).not.toContain('this should not be in final bundle')
  })
})

// https://github.com/vitejs/vite-ecosystem-ci/blob/main/utils.ts#L24
async function $(literals: TemplateStringsArray, ...values: any[]) {
  const cmd = literals.reduce(
    (result, current, i) => result + current + (values?.[i] != null ? `${values[i]}` : ''),
    '',
  )
  // eslint-disable-next-line no-console
  console.log(`${process.cwd()} $> ${cmd}`)
  const proc = execaCommand(cmd, {
    stdio: 'pipe',
  })
  proc.stdin && process.stdin.pipe(proc.stdin)
  proc.stdout && proc.stdout.pipe(process.stdout)
  proc.stderr && proc.stderr.pipe(process.stderr)
  const result = await proc
  return result.stdout
}
