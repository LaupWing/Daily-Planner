import firebase from 'firebase'
const db = firebase.firestore()

const state = {
   userData: {},
   colorLabels: null,
   dailyTasks: null,
   creatingTask: false
}

const getters = {
   getUserData: state => state.userData,
   colorLabels: state => state.colorLabels,
   dailyTasks: state => state.dailyTasks,
   creatingTask: state => state.creatingTask
}

const actions = {
   plannerWatcher({ rootGetters, commit }) {
      db
         .collection('planner')
         .doc(rootGetters.user.uid)
         .onSnapshot(snapshot => {
            if (snapshot.exists) {
               commit('setUserData', { ...snapshot.data() })
            }
         })
   },
   async updateColor({ commit, rootGetters }, updatedColorLabels) {
      await db
         .collection('planner')
         .doc(rootGetters.user.uid)
         .update({
            colorLabels: updatedColorLabels
         })
      commit('updateLabels', updatedColorLabels)
   },
   updateTask({ commit, rootGetters }, updatedTask) {
      return db
         .collection('planner')
         .doc(rootGetters.user.uid)
         .update({
            dailyTasks: updatedTask
         })
         .then(() => {
            commit('updateTasks', updatedTask)
         })
   },
   addNewTask({ commit, rootGetters }, addedTaskToDailyTasks) {
      return db
         .collection('planner')
         .doc(rootGetters.user.uid)
         .update({
            dailyTasks: addedTaskToDailyTasks
         })
         .then(() => {
            commit('updateTasks', addedTaskToDailyTasks)
         })
         .catch(() => {
            return db
               .collection('planner')
               .doc(rootGetters.user.uid)
               .set({
                  dailyTasks: addedTaskToDailyTasks
               })
               .then(() => {
                  commit('updateTasks', addedTaskToDailyTasks)
               })
         })
   }
}

const mutations = {
   setUserData: (state, { colorLabels, dailyTasks }) => {
      state.colorLabels = colorLabels
      state.dailyTasks = dailyTasks
   },
   updateTasks: (state, updatedTasks) => (state.userData.dailyTasks = updatedTasks),
   updateLabels: (state, updatedColorLabels) => (state.userData.colorLabels = updatedColorLabels),
   setCreatingTask: (state, onOrOff) => state.creatingTask = onOrOff
}

export default {
   state,
   getters,
   actions,
   mutations
}