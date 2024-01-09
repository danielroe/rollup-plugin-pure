import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: { emitCJS: true },
  externals: ['vite', 'rollup', 'esbuild', 'webpack'],
})
