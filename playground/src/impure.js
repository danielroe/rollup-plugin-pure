function defineComponent(options) {
  console.log('THIS_SHOULD_REMAIN_COMPONENT')
  return options
}

function definePage(options) {
  console.log('THIS_SHOULD_REMAIN_PAGE')
  return options
}

function $createConfig(options) {
  console.log('THIS_SHOULD_REMAIN_CONFIG')
  return options
}

export const comp = defineComponent({
  someComponent: true,
})

export const page = definePage({
  name: 'Example',
})

export const config = $createConfig({
  someConfig: true,
})

export const bar = 'world'
