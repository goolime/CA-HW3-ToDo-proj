import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg, showUserInteraction } from "../services/event-bus.service.js"
import { loadTodos,removeTodo,saveTodo } from "../store/actions/todos.actions.js"
import { setFilterBy } from "../store/actions/filterBy.actions.js"

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector } = ReactRedux

export function TodoIndex() {


    const todos = useSelector(storeState=>storeState.todoModule.todos)
    const filterBy = useSelector(storeState => storeState.filterModule.filterby)
    const isLoading = useSelector(storeState => storeState.loadingModule.loading)
    
    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    
    //const [_filterBy, _setFilterBy] = useState(filterBy)

    useEffect(()=>{
        const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
        setFilterBy(defaultFilter)
    },[])
    
    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos()
            .catch(err => {
                console.eror('err:', err)
                showErrorMsg('Cannot load todos')
            })
        
    }, [filterBy])

    function onRemoveTodo(todoId) {
        showUserInteraction({ txt: 'Are You sure you wants to remove this Todo?',
                            type:'normal',
                            buttons:[
                                {
                                    txt:'Continue',
                                    onClick:()=>{
                                        removeTodo(todoId)
                                        .then(() => showSuccessMsg(`Todo removed`) )
                                        .catch(err => {
                                            console.log('err:', err)
                                            showErrorMsg('Cannot remove todo ' + todoId)
                                        })
                                    }
                                },
                                {
                                    txt:'Cancel',
                                    onClick:()=>{}
                                }
                            ]})
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            .then( savedTodo => showSuccessMsg(`Todo is ${(savedTodo.isDone)? 'done' : 'back on your list'}`) )
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todoId)
            })
    }

    if (isLoading  && !todos) return <div>Loading...</div>
    if (!todos)
         return <div>No Data to be Shown</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={setFilterBy} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}