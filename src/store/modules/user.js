import firebase from 'firebase'

const state = {
   user: null,
   userData: null,
   geolocation: {
      lat: 52.370216,
      lng: 4.895168
   },
}

const getters = {
   user: state => state.user,
   userData: state => state.userData,
   geolocation: state => state.geolocation,
}

const actions = {
   userWatcher({ dispatch }) {
      firebase.auth().onAuthStateChanged(() => {
         dispatch('checkUser')
      })
   },
   checkUser({ commit, dispatch }) {
      const user = firebase.auth().currentUser
      commit('setUser', user)
      if (user) {
         dispatch('updateUser', {
            type: 'geolocation',
            value: {
               lat: state.geolocation.lat,
               lng: state.geolocation.lng
            }
         })
         dispatch('plannerWatcher')
      }
   },
   // eslint-disable-next-line
   updateUser({ commit }, { type, value }) {
      // firebase
      //     .firestore()
      //     .collection('users')
      //     .doc(state.user.uid)
      //     .update({
      //         [type]: value
      //     })
      //     .then((userData)=>{
      //         commit('setUserData', userData)
      //     })
   },
   setLocation({ commit }) {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(pos => {
            commit('setGeoLocation', {
               lat: pos.coords.latitude,
               lng: pos.coords.longitude
            })
         })
      }
   },
   // eslint-disable-next-line
   registerUser({ commit }, { email, password, alias }) {
      return firebase
         .auth()
         .createUserWithEmailAndPassword(email, password)
         .then(cred => {
            const user = cred.user
            return firebase
               .firestore()
               .doc(user.uid)
               .set({
                  alias: alias,
                  geolocation: null
               })
         })
         .catch(err => {
            throw err.message
         })
   },
   // eslint-disable-next-line
   loginUser({ commit }, { email, password }) {
      return firebase
         .auth()
         .signInWithEmailAndPassword(email, password)
         .then((user) => {
            return user
         })
         .catch(err => {
            throw err.message
         })
   }
}

const mutations = {
   setUser: (state, user) => (state.user = user),
   setUserData: (state, userData) => (state.userData = userData),
   setGeoLocation: (state, { lat, lng }) => (state.geolocation = { lat, lng }),
}

export default {
   state,
   getters,
   actions,
   mutations
}