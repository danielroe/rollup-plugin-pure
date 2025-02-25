import type { Plugin } from 'rollup'
import type { FilterPattern } from 'unplugin-utils'
import MagicString from 'magic-string'
import { stripLiteral } from 'strip-literal'
import { createFilter } from 'unplugin-utils'

export interface PureAnnotationsOptions {
  sourcemap?: boolean
  functions: string[]
  include?: FilterPattern
  exclude?: FilterPattern
}

export function PluginPure(options: PureAnnotationsOptions): Plugin {
  const FUNCTION_RE = new RegExp(
    `(?<!\\/\\* #__PURE__ \\*\\/ )(?<![a-zA-Z0-9_$])(${options.functions
      .join('|')
      .replaceAll('$', '\\$')})\\s*\\(`,
    'g',
  )
  const FUNCTION_RE_SINGLE = new RegExp(
    `(?<!\\/\\* #__PURE__ \\*\\/ )(?<![a-zA-Z0-9_$])(${options.functions
      .join('|')
      .replaceAll('$', '\\$')})\\s*\\(`,
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
          s.overwrite(match.index!, match.index! + match[0].length, `/* #__PURE__ */ ${match[0]}`)
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
