import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: sessionStorage.getItem("jwt") ? true : false,
    isAdmin: sessionStorage.getItem("isAdmin") ? true : false,
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});
