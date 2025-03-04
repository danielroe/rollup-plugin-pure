import { build } from 'vite'
import { bench } from 'vitest'

bench('pure annotation', async () => {
  await build({
    root: './playground',
  })
})
