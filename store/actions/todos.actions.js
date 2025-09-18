import {todoService } from '../../services/todo.service.js'
import { setLoading } from './loading.actions.js'
import {ADD_TODO, REMOVE_TODO , SET_TODOS , UPDATE_TODO} from '../reducers/todo.reducer.js'
import { store } from '../store.js'
import { incUserBalance } from './user.actions.js'

export function loadTodos(){
    setLoading(true)
    const storeState = store.getState() 
    return todoService.query(storeState.filterModule.filterby)
        .then( todos => {
            store.dispatch({type:SET_TODOS, todos}) 
        })
        .finally(()=> setLoading(false))
        .catch(err => errorHandler(err,'load todos', 'Cannot load todos'))
}

export function removeTodo(todoId){
    return todoService.remove(todoId)
        .then(()=>store.dispatch({type:REMOVE_TODO, todoId }))
        .catch(err => errorHandler(err,'remove todo', 'Cannot remove todo'))
}

export async function saveTodo(todo){
    if(todo._id){
        const oldTodo = await todoService.get(todo._id)
        const currentUser= await store.getState().userModule.loggedInUser
        
        if(!oldTodo.isDone && todo.isDone && currentUser){
            incUserBalance(currentUser._id)
        }
    }
    const type = todo._id ? UPDATE_TODO : ADD_TODO
    return todoService.save(todo)
        .then( (savedTodo)=>{
            store.dispatch({type,todo:savedTodo})
            return savedTodo 
        })
        .catch( err=>errorHandler(err,'save Car',`could not ${type===ADD_TODO? 'add': 'update'} todo`) )
}

function errorHandler (err,action, msg){
    console.log(`todos actions -> ${action} -> ${msg}`)
    throw err
}