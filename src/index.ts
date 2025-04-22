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
        let offset = 0

        walk(ast, {
          enter(_node) {
            const node = withLocations(_node)

            // Handle function declarations - add @__NO_SIDE_EFFECTS__ annotation
            if (
              node.type === 'FunctionDeclaration'
              && node.id
              && isMatched(node.id.name, options.functions)
              // @ts-expect-error untyped
              && !node._rollupAnnotations?.some(i => i.type === 'noSideEffects')
            ) {
              const annotation = '/*@__NO_SIDE_EFFECTS__*/ '
              s.prependRight(node.start, annotation)
              offset += annotation.length
            }

            // Handle function calls - add @__PURE__ annotation
            if (
              node.type === 'CallExpression'
              && node.callee.type === 'Identifier'
              && isMatched(node.callee.name, options.functions)
              // @ts-expect-error untyped
              && !node._rollupAnnotations?.some(i => i.type === 'pure')
            ) {
              const annotation = '/*@__PURE__*/ '
              s.prependRight(node.start, annotation)
              offset += annotation.length
            }

            if (offset) {
              node.start += offset
            }
          },
          leave(_node) {
            if (offset) {
              const node = withLocations(_node)
              node.end += offset
            }
          },
        })

        if (offset) {
          return {
            code: s.toString(),
            ast: withLocations(ast),
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
