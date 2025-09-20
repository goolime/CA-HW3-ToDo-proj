import { storageService } from "./async-storage.service.js"


export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    incBalance,
    save,
    logAction
}
const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname, balance: 0 , prefs: {color: '#f0f0f0', bgColor: '#606b5b'} , actions:[]}
    user.createdAt = user.updatedAt = Date.now()
    user.actions.push({time:user.createdAt, msg: `Created User ${username}`})

    return storageService.post(STORAGE_KEY, user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, balance:user.balance, prefs:user.prefs, actions:user.actions }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',
    }
}

function incBalance(userId){
    return getById(userId).then(user=>{
        const newUser={...user}
        newUser.balance=newUser.balance+10
        return newUser
    }).then(user=> {
        storageService.put(STORAGE_KEY, user)
    })
}

function save(user){
    return getById(user._id)
    .then(oldUser=>{
        const newUser={...oldUser,...user}
        newUser.updatedAt=Date.now()
        return newUser
    }).then(async user=> 
        await storageService.put(STORAGE_KEY, user)
    ).then(async user=>
        await _setLoggedinUser(user)
    )
}

function logAction(userId,action){
    return getById(userId)
     .then(async user=>{
        const newUser= {...user,actions:[action,...user.actions]}
        return await save(newUser)
     })
}

// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999
// }