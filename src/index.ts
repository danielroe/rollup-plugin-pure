import type { Program } from 'estree'
import type { Plugin } from 'rollup'
import type { FilterPattern } from 'unplugin-utils'
import { walk } from 'estree-walker'
import MagicString from 'magic-string'
import { createFilter } from 'unplugin-utils'

export interface PureAnnotationsOptions {
  sourcemap?: boolean
  functions: (string | RegExp)[]
  include?: FilterPattern
  exclude?: FilterPattern
}

const withLocations = <T>(node: T) => node as T & { start: number, end: number }
export function PluginPure(options: PureAnnotationsOptions): Plugin {
  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'rollup-plugin-pure',
    transform: {
      order: 'post',
      handler(code, id) {
        if (!filter(id)) {
          return
        }

        // quick check for early return
        if (options.functions.every(func => typeof func === 'string' && !code.includes(func))) {
          return
        }

        let ast: Program
        try {
          ast = this.parse(code)
        }
        catch {
          return null
        }

        const s = new MagicString(code)

        walk(ast, {
          enter(_node) {
            const node = withLocations(_node)

            // Handle function declarations - add @__NO_SIDE_EFFECTS__ annotation
            if (
              node.type === 'FunctionDeclaration'
              && node.id
              && isMatched(node.id.name, options.functions)
            ) {
              for (const _comment of ast.comments || []) {
                const comment = withLocations(_comment)
                if (comment.end <= node.start && comment.value.includes('__NO_SIDE_EFFECTS__')) {
                  return
                }
              }
              s.prependRight(node.start, '/*@__NO_SIDE_EFFECTS__*/ ')
            }

            // Handle function calls - add @__PURE__ annotation
            if (
              node.type === 'CallExpression'
              && node.callee.type === 'Identifier'
              && isMatched(node.callee.name, options.functions)
            ) {
              for (const _comment of ast.comments || /* v8-ignore */ []) {
                const comment = withLocations(_comment)
                if (comment.end <= node.start && comment.value.includes('__PURE__')) {
                  return
                }
              }
              s.prependRight(node.start, '/*@__PURE__*/ ')
            }
          },
        })

        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: options.sourcemap ? /* v8-ignore */ s.generateMap({ hires: true }) : undefined,
          }
        }
      },
    },
  }
}

function isMatched(name: string, patterns: (string | RegExp)[]) {
  return patterns.some(pattern =>
    typeof pattern === 'string' ? name === pattern : pattern.test(name),
  )
}
