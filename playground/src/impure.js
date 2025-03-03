function defineComponent(options) {
  console.log('THIS_SHOULD_REMAIN_IMPURE')
  return options
}

function $createConfig(options) {
  console.log('THIS_SHOULD_REMAIN_CONFIG')
  return options
}

export const comp = defineComponent({
  someComponent: true,
})

export const config = $createConfig({
  someConfig: true,
})

export const bar = 'world'
