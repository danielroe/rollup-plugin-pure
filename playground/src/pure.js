function defineComponent(options) {
  console.log('THIS_SHOULD_BE_REMOVED_PURE')
  return options
}

// eslint-disable-next-line antfu/top-level-function
const $createConfig = (options) => {
  console.log('THIS_SHOULD_BE_REMOVED_CONFIG')
  return options
}

// Already annotated function with # style
/* #__NO_SIDE_EFFECTS__ */ function hashStyleFunction(options) {
  console.log('THIS_SHOULD_BE_REMOVED_HASH_STYLE')
  return options
}

// Normal exports should be annotated
export const comp = defineComponent({
  someComponent: true,
})

export const config = $createConfig({
  someConfig: true,
})

hashStyleFunction({
  someHashStyle: true,
})

// Already annotated call - should not be double annotated
export const alreadyAnnotated = /* @__PURE__ */ defineComponent({
  someComponent: true,
})
export const hashStyleAnnotated = /* #__PURE__ */ $createConfig({
  someConfig: true,
})

// ensures regex isn't over-eager
defineComponent($createConfig())

export const foo = 'hello'
