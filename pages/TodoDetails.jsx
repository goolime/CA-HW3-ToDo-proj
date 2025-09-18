import { todoService } from "../services/todo.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"
import {store} from '../store/store.js'
import { loadTodos, saveTodo } from "../store/actions/todos.actions.js" 

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM
const { useSelector } = ReactRedux

export function TodoDetails() {

    const [todo, setTodo] = useState(null)
    const params = useParams()
    const navigate = useNavigate()
    const isLoading = useSelector(storeState => storeState.loadingModule.loading)
    

    useEffect(() => {
        loadTodo()
    }, [params.todoId])


    function loadTodo() {
        loadTodos()
            .then(()=>{
                const todos = store.getState().todoModule.todos
                const todoIdx = todos.findIndex((currTodo) => currTodo._id === params.todoId)
                const todo = todos[todoIdx]
                const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
                const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
                todo.nextTodoId = nextTodo._id
                todo.prevTodoId = prevTodo._id
                setTodo(todo)
            })
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load todo')
                navigate('/todo')
            })
    }

    function onBack() {
        // If nothing to do here, better use a Link
        navigate('/todo')
        // navigate(-1)
    }

    if(!todo || isLoading) return <div>Loading...</div>
    return (
        <section className="todo-details">
            <h1 className={(todo.isDone)? 'done' : ''}>{todo.txt}</h1>
            <h2>{(todo.isDone)? 'Done!' : 'In your list'}</h2>

            <h1>Todo importance: {todo.importance}</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem accusantium, itaque ut voluptates quo? Vitae animi maiores nisi, assumenda molestias odit provident quaerat accusamus, reprehenderit impedit, possimus est ad?</p>
            <button onClick={onBack}>Back to list</button>
            <div>
                <Link to={`/todo/${todo.nextTodoId}`}>Next Todo</Link> |
                <Link to={`/todo/${todo.prevTodoId}`}>Previous Todo</Link>
            </div>
        </section>
    )
}