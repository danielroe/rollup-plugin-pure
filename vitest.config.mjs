import codspeedPlugin from '@codspeed/vitest-plugin'
import { isCI } from 'std-env'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: isCI ? [codspeedPlugin()] : [],
  test: {
    coverage: {
      reporter: ['text', 'json'],
      include: ['src'],
    },
  },
})
