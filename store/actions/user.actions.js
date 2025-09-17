import { userService } from "../../services/user.service.js"
import { SET_USER } from "../reducers/user.reducer.js"
import {store} from '../store.js'

export function login(credentials){
    return userService.login(credentials)
        .then(user=>{
            store.dispatch({type: SET_USER, user})
        })
        .catch(err=>errorHandler(err,'login','Cannot login'))
}

export function signup(credentials){
    return userService.signup(credentials)
        .then(user=>{
            store.dispatch({type: SET_USER, user})
        })
        .catch(err=>errorHandler(err,'signup','Cannot signup'))
}

export function logout(){
    return userService.logout()
        .then(()=>{
            store.dispatch({type: SET_USER, user:null})
        })
        .catch(err=>errorHandler(err,'logout','Cannot logout'))
}

function errorHandler (err,action, msg){
    console.log(`user actions -> ${action} -> ${msg}`)
    throw err
}