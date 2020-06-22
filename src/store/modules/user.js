import firebase from 'firebase'

const state = {
    user: null
}

const getters = {
    user: state => state.user
}

const actions = {
    userWatcher({dispatch}){
        firebase.auth().onAuthStateChanged(()=>{
            dispatch('checkUser')
        })
    },
    checkUser({commit}){
        const user = firebase.auth().currentUser
        commit('setUser', user)
    },
}

const mutations = {
    setUser: (state,user) => (state.user = user),
}

export default {
    state,
    getters,
    actions,
    mutations
}