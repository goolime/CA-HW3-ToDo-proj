import { SET_LOADING , FLIP_LOADING } from '../reducers/loading.reducer.js'
import { store } from '../store.js'

export function setLoading(loading){
    store.dispatch({type:SET_LOADING, loading})
}

export function flipLoading(){
    store.dispatch({type:FLIP_LOADING})
}