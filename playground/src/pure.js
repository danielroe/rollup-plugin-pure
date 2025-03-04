function defineComponent(options) {
  console.log('THIS_SHOULD_BE_REMOVED_COMPONENT')
  return options
}

function definePage(options) {
  console.log('THIS_SHOULD_BE_REMOVED_PAGE')
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

// Normal exports should be annotated
export const page = definePage({
  name: 'Example',
})

export const config = $createConfig({
  someConfig: true,
})

hashStyleFunction({
  someHashStyle: true,
})

// Already annotated call - should not be double annotated
export const compAnnotated = /* @__PURE__ */ defineComponent({
  someComponent: true,
})
export const pageAnnotated = /* @__PURE__ */ definePage({
  name: 'Example',
})
export const hashStyleAnnotated = /* #__PURE__ */ $createConfig({
  someConfig: true,
})

// ensures regex isn't over-eager
defineComponent($createConfig())
definePage($createConfig())

export const foo = 'hello'
