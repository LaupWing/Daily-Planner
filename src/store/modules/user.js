import firebase from 'firebase'

const state = {
    user: null,
    userData: null,
    geolocation:{
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
    userWatcher({dispatch}){
        firebase.auth().onAuthStateChanged(()=>{
            dispatch('checkUser')
        })
    },
    checkUser({commit}){
        const user = firebase.auth().currentUser
        commit('setUser', user)
    },
    updateUser({commit}, {lat, lng}){
        db
            .collection('users')
            .doc(state.user.uid)
            .update({
                geolocation:{
                    lat: lat,
                    lng: lng
                }
            })
            .then((userData)=>{
                commit('setUserData', userData)
            })
    },
    setLocation({commit}){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(pos=>{
                commit('setGeoLocation', {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                })
            })
        }
    }
}

const mutations = {
    setUser: (state,user) => (state.user = user),
    setUserData: (state,userData) => (state.userData = userData),
    setGeoLocation: (state,{lat,lng}) => (state.geolocation = {lat,lng}),
}

export default {
    state,
    getters,
    actions,
    mutations
}