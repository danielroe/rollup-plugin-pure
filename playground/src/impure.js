function defineComponent (options) {
  console.log('this should be in final bundle')
  return options
}

export const comp = defineComponent({
  someComponent: true
})

export const bar = 'world'
