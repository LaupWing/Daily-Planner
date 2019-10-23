import firebase from 'firebase'
import db from '@/firebase/init.js'

const state = {
    dailyTasks:[],
    currentUser: null
}

const getters = {
    getDailyTasks: state => state.dailyTasks,
    getUsers: state => state.currentUser
}

const actions = {
    async fetchDailyTasks({commit}){
        const doc  = await db
            .collection('planner')
            .doc(state.currentUser.uid)
            .get()
        if(doc.exists){
            if(doc.data().dailyTasks){
                return commit('setDailyTasks', doc.data().dailyTasks)
            }
        }
        commit('setDailyTasks', [])
    },
    fetchUser({commit}){
        const user = firebase.auth().currentUser
        commit('setUser', user)
    }
}

const mutations = {
    setUser: (state,user) => (state.currentUser = user),
    setDailyTasks: (state, dailyTasks)=> (state.dailyTasks = dailyTasks)
}

export default {
    state,
    getters,
    actions,
    mutations
}