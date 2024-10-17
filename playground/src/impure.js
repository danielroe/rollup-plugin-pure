function defineComponent(options) {
  console.log('this should be in final bundle')
  return options
}

function $createConfig(options) {
  console.log('this should be in final bundle')
  return options
}

export const comp = defineComponent({
  someComponent: true,
})

export const config = $createConfig({
  someConfig: true,
})

export const bar = 'world'
