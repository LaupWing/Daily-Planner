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
    checkUser({commit}){
        const user = firebase.auth().currentUser
        commit('setUser', user)
    },
    async updateTask({commit}, updatedTask){
        return await db
                .collection('planner')
                .doc(firebase.auth().currentUser.uid)
                .update({
                    dailyTasks: updatedTask
                })
                .then(()=>{
                    commit('updateTask', updatedTask)
                })
    }
}

const mutations = {
    setUser: (state,user) => (state.currentUser = user),
    setDailyTasks: (state, dailyTasks)=> (state.dailyTasks = dailyTasks),
    updateTask: (state,updatedTasks)=>(state.dailyTasks = updatedTasks)
}

export default {
    state,
    getters,
    actions,
    mutations
}