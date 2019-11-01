import firebase from 'firebase'
import db from '@/firebase/init.js'

const state = {
    userData:{},
    currentUser: null
}

const getters = {
    getUserData: state => state.userData,
    getUser: state => state.currentUser
}

const actions = {
    async fetchUserData({commit}){
        const doc  = await db
            .collection('planner')
            .doc(state.currentUser.uid)
            .get()
        if(doc.exists){
            return commit('setUserData', doc.data())
        }
        commit('setUserData', [])
    },
    checkUser({commit}){
        const user = firebase.auth().currentUser
        commit('setUser', user)
    },
    async updateColor({commit}, updatedColorLabels){
        await db
            .collection('planner')
            .doc(state.currentUser.uid)
            .update({
                colorLabels: updatedColorLabels
            }) 
        commit('updateLabels', updatedColorLabels)
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
    updateTasks: (state,updatedTasks)=>(state.userData.dailyTasks = updatedTasks),
    updateLabels: (state,updatedColorLabels)=>(state.userData.colorLabels = updatedColorLabels),
}

export default {
    state,
    getters,
    actions,
    mutations
}