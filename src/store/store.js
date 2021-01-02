import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isAuthenticated: localStorage.getItem('jwt') ? true : false,
        isAdmin: localStorage.getItem('isAdmin') ? true: false
    },
    getters: {
        isAuthenticated: state => !!state.token,
    },
   
})