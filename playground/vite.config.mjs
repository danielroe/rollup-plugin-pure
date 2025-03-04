import { PluginPure } from 'rollup-plugin-pure'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    PluginPure({
      functions: [/^define(Component|Page)$/, '$createConfig', 'hashStyleFunction'],
      include: [/(?<!im)pure\.js$/],
    }),
  ],
})
