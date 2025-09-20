import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { store } from '../store/store.js'
import { loadTodos, saveTodo } from "../store/actions/todos.actions.js" 

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM
const { useSelector } = ReactRedux

export function TodoEdit() {

    const [todoToEdit, setTodoToEdit] = useState(todoService.getEmptyTodo())
    const navigate = useNavigate()
    const params = useParams()
    const isLoading = useSelector(storeState => storeState.loadingModule.loading)
    

    useEffect(() => {
        if (params.todoId) loadTodo()
    }, [])

    function loadTodo() {
        loadTodos()
            .then(()=>{
                const todo =store.getState().todoModule.todos
                    .find(todo=>todo._id===params.todoId)
                setTodoToEdit(todo)
        })
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setTodoToEdit(prevTodoToEdit => ({ ...prevTodoToEdit, [field]: value }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        saveTodo(todoToEdit)
            .then((savedTodo) => {
                navigate('/todo')
                showSuccessMsg(`Todo Saved (id: ${savedTodo._id})`)
            })
            .catch(err => {
                showErrorMsg('Cannot save todo')
                console.log('err:', err)
                throw err
            })
    }

    if (isLoading) return <div>loading...</div>

    const { txt, importance, isDone } = todoToEdit
    return (
        <section className="todo-edit">
            <form onSubmit={onSaveTodo} >
                <label htmlFor="txt">Text:</label>
                <input onChange={handleChange} value={txt} type="text" name="txt" id="txt" />

                <label htmlFor="importance">Importance:</label>
                <input onChange={handleChange} value={importance} type="number" name="importance" id="importance" />

                <label htmlFor="isDone">isDone:</label>
                <input onChange={handleChange} checked={todoToEdit.isDone} value={isDone} type="checkbox" name="isDone" id="isDone" />
                
                <label htmlFor="color">Color:</label>
                <input onChange={handleChange} type="color" id="favcolor" name="color" value={todoToEdit.color}></input>

                <button>Save</button>
            </form>
        </section>
    )
}