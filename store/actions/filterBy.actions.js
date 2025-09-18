import { SET_FILTER_BY } from '../reducers/filterBy.reducer.js'
import { store } from '../store.js'

export function setFilterBy(filterby){
    return store.dispatch({type:SET_FILTER_BY,filterby})
}

