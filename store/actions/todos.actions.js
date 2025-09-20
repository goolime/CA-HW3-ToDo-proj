import {todoService } from '../../services/todo.service.js'
import { setLoading } from './loading.actions.js'
import {ADD_TODO, REMOVE_TODO , SET_TODOS , UPDATE_TODO} from '../reducers/todo.reducer.js'
import { store } from '../store.js'
import { incUserBalance, isUserLoggedIn, logAction, getUserId } from './user.actions.js'

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

export async function removeTodo(todoId){
    const txt = (await todoService.get(todoId)).txt
    return todoService.remove(todoId)
        .then(()=>{
            store.dispatch({type:REMOVE_TODO, todoId })
            logAction(`Removed the Todo: ${txt}`)
        })
        .catch(err => errorHandler(err,'remove todo', 'Cannot remove todo'))
}

export async function saveTodo(todo){
    const userIdToIncBalance= todo._id ? todo.isDone && !(await todoService.get(todo._id).done) : false
    const type = todo._id ? UPDATE_TODO : ADD_TODO
    return todoService.save(todo)
        .then( (savedTodo)=>{
            store.dispatch({type,todo:savedTodo})
            return savedTodo 
        })
        .then((savedTodo)=>{
            const msg= `${type===UPDATE_TODO ? 'Edited' : 'Added'} a Todo : "${savedTodo.txt}"` 
            logAction(msg).then(()=>{
                if(userIdToIncBalance){
                    incUserBalance()
                }
            }
            )
            return saveTodo
        })
        .catch( err=>errorHandler(err,'save Car',`could not ${type===ADD_TODO? 'add': 'update'} todo`) )
}

function errorHandler (err,action, msg){
    console.log(`todos actions -> ${action} -> ${msg}`)
    throw err
}