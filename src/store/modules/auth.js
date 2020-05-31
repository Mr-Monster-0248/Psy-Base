/* eslint-disable no-shadow */
const { session } = require('../session');

const state = {
  status: null,
  auth_token: null,
  loggedIn: false,
};

const getters = {
  isPending: (state) => state.status === 'pending',
  isLoggedIn: (state) => state.loggedIn,
  getToken: (state) => state.auth_token,
};

const mutations = {
  pending: (state) => {
    state.status = 'pending';
  },

  connectionSuccess: (state, token) => {
    state.auth_token = token;
    state.loggedIn = true;
  },

  connectionFaild: (state) => {
    state.status = 'error';
  },

  loggedOut: (state) => {
    state.auth_token = null;
    state.isLoggedIn = false;
  },
};

const actions = {

  logout: async ({ commit }) => {
    commit('loggedOut');
  },

  loginAdmin: async ({ commit }, { email, password }) => {
    commit('pending');
    try {
      const rep = await session.post('/auth/login-admin', { email, password });

      // Adding token to header of the request
      session.defaults.headers.common['auth-token'] = rep.data;
      commit('connectionSuccess', rep.data);
    } catch (e) {
      commit('connectionFaild');
      console.error(e.stack);
    }
  },

  loginWithEmailAndPassword: async ({ commit }, { email, password }) => {
    commit('pending');
    try {
      const rep = await session.post('/auth/login', { email, password });
      // console.log(rep.data);
      commit('connectionSuccess', rep.data);
      // console.log(password);
      // console.log(email);
    } catch (e) {
      console.error(e.stack);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
};
