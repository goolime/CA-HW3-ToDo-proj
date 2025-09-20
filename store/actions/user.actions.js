import { userService } from "../../services/user.service.js"
import { SET_USER, INC_BALANCE_USER, ADD_ACTION} from "../reducers/user.reducer.js"
import {store} from '../store.js'
import { setLoading } from "./loading.actions.js"

export function login(credentials){
    return userService.login(credentials)
        .then(user=>{
            store.dispatch({type: SET_USER, user})
            logAction(`Logged In`)
        })
        .catch(err=>errorHandler(err,'login','Cannot login'))
}

export function isUserLoggedIn(){
    return !!store.getState().userModule.loggedInUser
}

export function getUserStyle(){
    if (!isUserLoggedIn()) return {}
    const prefs = store.getState().userModule.loggedInUser.prefs
    return {color:prefs.color, backgroundColor:prefs.bgColor}
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
            logAction(`Logged Out`).then(
                ()=>
                    store.dispatch({type: SET_USER, user:null})
            ) 
            
        })
        .catch(err=>errorHandler(err,'logout','Cannot logout'))
}

export function incUserBalance(){
    if (!isUserLoggedIn) return
    const userId = store.getState().userModule.loggedInUser._id
    return userService.incBalance(userId)
        .then(()=>
            store.dispatch({type: INC_BALANCE_USER, userId})
        )
        .catch(err=>errorHandler(err,'incUserBalance','Cannot increace balance'))
}

export function saveUser(user){
        return userService.save(user)
            .then(newUser=>{
                store.dispatch({type:SET_USER,user:newUser})
                logAction(`Edited user ${newUser.fullname}`)
            })
            .catch(err=>errorHandler(err,'saveUser','Cannot save user'))

}

export function getUser(userId){
    setLoading(true)
    return userService.getById(userId)
        .then(user=>{
            setLoading(false)
            return user
        })
}

export function logAction(msg){
    if (!isUserLoggedIn()) return
    const action = {time:Date.now(), msg}

    return userService.logAction(store.getState().userModule.loggedInUser._id,action)
        .then(()=>{
            store.dispatch({type:ADD_ACTION, action})
        })
        .catch(err=>errorHandler(err,'logAction', 'Cannot log action'))
}

function errorHandler (err,action, msg){
    console.log(`user actions -> ${action} -> ${msg}`)
    throw err
}