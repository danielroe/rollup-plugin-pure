function defineComponent (options) {
  console.log('this should not be in final bundle')
  return options
}

function $createConfig (options) {
  console.log('this should not be in final bundle')
  return options
}

export const comp = defineComponent({
  someComponent: true
})

export const config = $createConfig({
  someConfig: true
})

// ensures it isn’t over-eager
defineComponent($createConfig())

// ensures it excludes preceding characters
console.log('other_defineComponent()')

export const foo = 'hello'
