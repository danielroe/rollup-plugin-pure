function defineComponent (options) {
  console.log('this should not be in final bundle')
  return options
}

export const comp = defineComponent({
  someComponent: true
})

export const foo = 'hello'
