
import { getUser, saveUser} from '../store/actions/user.actions.js'
import { showSuccessMsg,showErrorMsg } from '../services/event-bus.service.js'
import { UserActions } from '../cmps/UserActions.jsx'

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM
const { useSelector } = ReactRedux


export function UserDetails(){
    
    const [userToEdit, setUserToEdit] = useState({})
    const navigate = useNavigate()
    const params = useParams()
    const isLoading = useSelector(storeState => storeState.loadingModule.loading)

    useEffect(() => {
        if (params.userId) loadUser()
    }, [])

    function loadUser(){
        getUser(params.userId)
            .then(user=> setUserToEdit(user))
            .catch(err=>{
                console.error('err:', err)
                showErrorMsg('Cannot load user')
                navigate('/')
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

        if (target.type === 'color')
            setUserToEdit(prevUserToEdit=>({...prevUserToEdit,prefs:{...prevUserToEdit.prefs,[field]:value}}))
        else
            setUserToEdit(prevTodoToEdit => ({ ...prevTodoToEdit, [field]: value }))
    }

    function saveChanges(ev){
        ev.preventDefault()
        saveUser(userToEdit)
            .then(()=>{
                navigate('/')
                showSuccessMsg(`User Changes Saved`)
            })
    }
    const {fullname, prefs, actions} =userToEdit

    if (isLoading || !prefs || !fullname) return <div>Loading...</div> 
    return <div>
        <form onSubmit={saveChanges}>
            <label>Name:</label>
            <input type="text"
                    name="username"
                    value={fullname}
                    onChange={handleChange}
                    />
            <label>Color:</label>
            <input type="color" id="favcolor" name="color" value={prefs.color} onChange={handleChange}></input>

            <label>Bg Color:</label>
            <input type="color" id="favcolor" name="bgColor" value={prefs.bgColor} onChange={handleChange}></input>
            <button>Save Changes</button>
        </form>

        <UserActions actions={actions} />
    </div>
}