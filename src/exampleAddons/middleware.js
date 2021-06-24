export const print1 = (storeAPI) => (next) => (action) => {
  console.log('1')
  return next(action)
}

export const print2 = (storeAPI) => (next) => (action) => {
  console.log('2')
  return next(action)
}

export const print3 = (storeAPI) => (next) => (action) => {
  console.log('3')
  return next(action)
}

export const logger = (store) => (next) => (action) => {
  console.log(action.type)
  console.log('before:', store.getState())
  console.log('action:', action)
  const result =  next(action)
  console.log('after:', store.getState())

  return result
}
