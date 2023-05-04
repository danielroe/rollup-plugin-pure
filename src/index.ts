import MagicString from 'magic-string'
import type { Plugin } from 'rollup'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import { stripLiteral } from 'strip-literal'

export interface PureAnnotationsOptions {
  sourcemap?: boolean
  functions: string[]
  include?: FilterPattern
  exclude?: FilterPattern
}

export function PluginPure(options: PureAnnotationsOptions): Plugin {
  const FUNCTION_RE = new RegExp(
    `(?<!\\/\\* #__PURE__ \\*\\/ )\\b(${options.functions.join('|')})\\s*\\(`,
    'g'
  )
  const FUNCTION_RE_SINGLE = new RegExp(
    `(?<!\\/\\* #__PURE__ \\*\\/ )\\b(${options.functions.join('|')})\\s*\\(`
  )

  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'nuxt:pure-annotations',
    transform: {
      order: 'post',
      handler(code, id) {
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
    },
  }
}
