import firebase from 'firebase'
import db from '@/firebase/init.js'

const state = {
    userData:[],
    currentUser: null
}

const getters = {
    getDailyTasks: state => state.dailyTasks,
    getUsers: state => state.currentUser
}

const actions = {
    async fetchUserData({commit}){
        const doc  = await db
            .collection('planner')
            .doc(state.currentUser.uid)
            .get()
        if(doc.exists){
            // if(doc.data()){
            return commit('setUserData', doc.data())
            // }
        }
        commit('setUserData', [])
    },
    checkUser({commit}){
        const user = firebase.auth().currentUser
        commit('setUser', user)
    },
    updateTask({commit}, updatedTask){
        return db
                .collection('planner')
                .doc(state.currentUser.uid)
                .update({
                    dailyTasks: updatedTask
                })
                .then(()=>{
                    commit('updateTasks', updatedTask)
                })
    },
    addNewTask({commit}, addedTaskToDailyTasks){
        return db
            .collection('planner')
            .doc(state.currentUser.uid)
            .update({
                dailyTasks: addedTaskToDailyTasks
            })
            .then(()=>{
                commit('updateTasks', addedTaskToDailyTasks)
            })
            .catch(()=>{
                return db
                    .collection('planner')
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        dailyTasks: addedTaskToDailyTasks
                    })
                    .then(()=>{
                        commit('updateTasks', addedTaskToDailyTasks)
                    })
            })
    }
}

const mutations = {
    setUser: (state,user) => (state.currentUser = user),
    setUserData: (state, userData)=> (state.userData = userData),
    updateTasks: (state,updatedTasks)=>(state.dailyTasks = updatedTasks)
}

export default {
    state,
    getters,
    actions,
    mutations
}