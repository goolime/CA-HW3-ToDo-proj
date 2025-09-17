import { userReducer } from "./reducers/user.reducer.js"
import { todosReducer } from './reducers/todo.reducer.js'
import { filterByReducer } from "./reducers/filterBy.reducer.js"

const { createStore, combineReducers, compose } = Redux

const rootReducer = combineReducers({
    userModule: userReducer,
    todoModule: todosReducer,
    filterModule: filterByReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers())