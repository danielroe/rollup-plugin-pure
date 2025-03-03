import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'pathe'

import { build } from 'vite'
import { describe, expect, it } from 'vitest'

describe('pure annotation', () => {
  it('e2e', async () => {
    const assetsDir = fileURLToPath(new URL('../playground/dist/assets', import.meta.url))
    await build({
      root: './playground',
    })
    const filename = await readdir(assetsDir).then(files => files.find(f => f.endsWith('.js')))
    // @ts-expect-error there must be a file or we _want_ a test failure
    const code = await readFile(join(assetsDir, filename), 'utf-8')

    // Verify that string literals from impure.js should be present in the bundle
    expect(code).toContain('THIS_SHOULD_REMAIN_IMPURE')
    expect(code).toContain('THIS_SHOULD_REMAIN_CONFIG')

    // Verify that string literals from pure.js should not be present in the bundle
    expect(code).not.toContain('THIS_SHOULD_BE_REMOVED_PURE')
    expect(code).not.toContain('THIS_SHOULD_BE_REMOVED_CONFIG')
    expect(code).not.toContain('THIS_SHOULD_BE_REMOVED_HASH_STYLE')

    // Verify that exports strings are present in some form
    expect(code).toContain('hello') // The value of foo export
    expect(code).toContain('world') // The value of bar export
  })
})
