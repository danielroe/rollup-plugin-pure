import type { Program } from 'estree'
import type { Plugin } from 'rollup'
import type { FilterPattern } from 'unplugin-utils'
import { walk } from 'estree-walker'
import MagicString from 'magic-string'
import { createFilter } from 'unplugin-utils'

export interface PureAnnotationsOptions {
  sourcemap?: boolean
  functions: string[]
  include?: FilterPattern
  exclude?: FilterPattern
}

interface Annotation {
  start: number
  annotation: string
}

const withLocations = <T>(node: T) => node as T & { start: number, end: number }
export function PluginPure(options: PureAnnotationsOptions): Plugin {
  const functionSet = new Set(options.functions)
  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'rollup-plugin-pure',
    transform: {
      order: 'post',
      handler(code, id) {
        if (!filter(id)) {
          return
        }

        // quick check if any of the functions are in the code
        if (!options.functions.some(func => code.includes(func))) {
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
        const annotations: Annotation[] = []

        walk(ast, {
          enter(_node) {
            const node = withLocations(_node)

            // Handle function declarations - add @__NO_SIDE_EFFECTS__ annotation
            if (
              node.type === 'FunctionDeclaration'
              && node.id
              && functionSet.has(node.id.name)
            ) {
              for (const _comment of ast.comments || []) {
                const comment = withLocations(_comment)
                if (comment.end <= node.start && comment.value.includes('__NO_SIDE_EFFECTS__')) {
                  return
                }
              }
              const annotation = '/*@__NO_SIDE_EFFECTS__*/ '
              s.prependRight(node.start, annotation)
              annotations.push({ start: node.start, annotation })
              return
            }

            // Handle function calls - add @__PURE__ annotation
            if (
              node.type === 'CallExpression'
              && node.callee.type === 'Identifier'
              && functionSet.has(node.callee.name)
            ) {
              for (const _comment of ast.comments || /* v8-ignore */ []) {
                const comment = withLocations(_comment)
                if (comment.end <= node.start && comment.value.includes('__PURE__')) {
                  return
                }
              }
              const annotation = '/*@__PURE__*/ '
              s.prependRight(node.start, annotation)
              annotations.push({ start: node.start, annotation })
            }
          },
        })

        if (annotations.length) {
          fixAst(ast, annotations)

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

function fixAst(ast: Program, annotations: Annotation[]) {
  walk(ast, {
    enter(_node) {
      let startOffset = 0
      let endOffset = 0
      const node = withLocations(_node)

      for (const annotation of annotations) {
        if (annotation.start <= node.start) {
          startOffset += annotation.annotation.length
        }
        if (annotation.start <= node.end) {
          endOffset += annotation.annotation.length
        }
      }

      if (startOffset > 0 || endOffset > 0) {
        node.start += startOffset
        node.end += endOffset
      }
    },
  })

  // TODO: If the `ast.comments` should be updated,
  // push the annotations to it here.
  // If not, remove the `ast.comments` check above.
}
