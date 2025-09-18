import { userService } from "../../services/user.service.js"

export const SET_USER = 'SET_USER'
export const INC_BALANCE_USER= 'INC_BALANCE_USER'

const initialState = {
    loggedInUser: userService.getLoggedinUser()
}

export function userReducer(state= initialState,cmd){
    switch(cmd.type){
        case SET_USER:
            return {...state,loggedInUser:cmd.user}
        case INC_BALANCE_USER:
            return {...state,loggedInUser:{
                    ...state.loggedInUser,
                    balance: state.loggedInUser.balance+10
                }
            }
        default:
            return state
    }
}