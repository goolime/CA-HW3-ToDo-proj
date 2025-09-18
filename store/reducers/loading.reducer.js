export const SET_LOADING='SET_LOADING'
export const FLIP_LOADING='FLIP_LOADING'

const initialState = {
    loading: true
}

export function loadingReducer (state= initialState,cmd){
    switch(cmd.type){
        case SET_LOADING:
            return {...state,loading:cmd.loading}
        case FLIP_LOADING:
            return {...state, loading:!state.loading}
        default:
            return state
    }
}