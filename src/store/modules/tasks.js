import firebase from 'firebase'
const db = firebase.firestore()

const state = {
    userData:{},
    colorLabels: null,
    dailyTasks: null
}

const getters = {
    getUserData: state => state.userData,
    colorLabels: state => state.colorLabels
}

const actions = {
    async fetchUserData({commit, rootGetters}){
        const doc  = await db
            .collection('planner')
            .doc(rootGetters.user.uid)
            .get()
        if(doc.exists){
            commit('setUserData', {...doc.data()})
        }
    },
    async updateColor({commit, rootGetters}, updatedColorLabels){
        await db
            .collection('planner')
            .doc(rootGetters.user.uid)
            .update({
                colorLabels: updatedColorLabels
            }) 
        commit('updateLabels', updatedColorLabels)
    },
    updateTask({commit, rootGetters}, updatedTask){
        return db
                .collection('planner')
                .doc(rootGetters.user.uid)
                .update({
                    dailyTasks: updatedTask
                })
                .then(()=>{
                    commit('updateTasks', updatedTask)
                })
    },
    addNewTask({commit, rootGetters}, addedTaskToDailyTasks){
        return db
            .collection('planner')
            .doc(rootGetters.user.uid)
            .update({
                dailyTasks: addedTaskToDailyTasks
            })
            .then(()=>{
                commit('updateTasks', addedTaskToDailyTasks)
            })
            .catch(()=>{
                return db
                    .collection('planner')
                    .doc(rootGetters.user.uid)
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
    setUserData: (state, {colorLabels, dailyTasks})=> {
        state.colorLabels = colorLabels
        state.dailyTasks = dailyTasks
    },
    updateTasks: (state,updatedTasks)=>(state.userData.dailyTasks = updatedTasks),
    updateLabels: (state,updatedColorLabels)=>(state.userData.colorLabels = updatedColorLabels),
}

export default {
    state,
    getters,
    actions,
    mutations
}