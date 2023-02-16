import { defineConfig } from 'vite'
import { PluginPure } from 'rollup-plugin-pure'

export default defineConfig({
  plugins: [
    PluginPure({
      functions: ['defineComponent'],
      include: [/(?<!im)pure\.js$/],
    }),
  ],
})
