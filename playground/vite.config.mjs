import { PluginPure } from 'rollup-plugin-pure'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    PluginPure({
      functions: ['defineComponent', '$createConfig'],
      include: [/(?<!im)pure\.js$/],
    }),
  ],
})
