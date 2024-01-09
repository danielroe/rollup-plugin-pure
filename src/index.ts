import type { FilterPattern } from '@rollup/pluginutils'
import MagicString from 'magic-string'
import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import { stripLiteral } from 'strip-literal'

export interface PureAnnotationsOptions {
  sourcemap?: boolean
  functions: string[]
  include?: FilterPattern
  exclude?: FilterPattern
}

export const unpluginPure = createUnplugin((options: PureAnnotationsOptions) => {
  const FUNCTION_RE = new RegExp(
    `(?<!\\/\\* #__PURE__ \\*\\/ )(?<![a-zA-Z0-9_$])(${options.functions
      .join('|')
      .replaceAll('$', '\\$')})\\s*\\(`,
    'g'
  )
  const FUNCTION_RE_SINGLE = new RegExp(
    `(?<!\\/\\* #__PURE__ \\*\\/ )(?<![a-zA-Z0-9_$])(${options.functions
      .join('|')
      .replaceAll('$', '\\$')})\\s*\\(`
  )

  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'unplugin-pure',
    transform(code, id) {
      if (!filter(id) || !FUNCTION_RE_SINGLE.test(code)) {
        return
      }

      const s = new MagicString(code)
      const strippedCode = stripLiteral(code)

      for (const match of strippedCode.matchAll(FUNCTION_RE)) {
        s.overwrite(match.index!, match.index! + match[0].length, '/* #__PURE__ */ ' + match[0])
      }

      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: options.sourcemap ? s.generateMap({ hires: true }) : undefined,
        }
      }
    },
  }
})

/**
 * Maintain backwards compatibility with existing rollup setup.
 */
export const PluginPure = unpluginPure.rollup
export const esbuildPure = unpluginPure.esbuild
export const vitePure = unpluginPure.vite
export const webpackPure = unpluginPure.webpack
