import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducer'
import { print1, print2, print3, logger } from './exampleAddons/middleware'

const composedEnhancer = composeWithDevTools(
    // EXAMPLE: Add whatever middleware you actually want to use here
    applyMiddleware(logger, print1, print2, print3, thunkMiddleware)
    // other store enhancers if any
)

const store = createStore(rootReducer, composedEnhancer)

export default store
