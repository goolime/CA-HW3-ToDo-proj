import { todoService } from "../../services/todo.service.js";

export const SET_FILTER_BY = 'SET_FILTER_BY'

const initialState = {
    filterby: todoService.getDefaultFilter()
}

export function filterByReducer(state=initialState,cmd){
    switch (cmd.type){
        case SET_FILTER_BY:
            return {...state, filterby:cmd.filterby}
        default:
            return state
    }
}