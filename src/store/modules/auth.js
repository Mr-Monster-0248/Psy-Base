/* eslint-disable no-shadow */
import cookie from 'vue-cookie';
import jwt from 'jsonwebtoken';
import router from 'vue-router';

const { session } = require('../session');

const state = {
  status: null,
  loggedIn: false,
  admin: false,
};

const getters = {
  isPending: (state) => state.status === 'pending',
  isLoggedIn: (state) => state.loggedIn,
  isAdmin: (state) => state.admin,
};

const mutations = {
  pending: (state) => {
    state.status = 'pending';
  },

  connectionSuccess: (state) => {
    state.loggedIn = true;
  },

  connectionAdminSuccess: (state) => {
    state.loggedIn = true;
    state.admin = true;
  },

  connectionFaild: (state) => {
    state.status = 'error';
  },

  loggedOut: (state) => {
    state.isLoggedIn = false;
    state.admin = false;
    state.status = null;
  },
};

const actions = {

  logout: async ({ commit }) => {
    cookie.delete('token');
    commit('loggedOut');
    router.push('/login');
  },

  loginAdmin: async ({ commit }, { email, password }) => {
    commit('pending');
    try {
      const rep = await session.post('/auth/login-admin', { email, password });

      // Adding token to header of the request
      cookie.set('token', rep.data);
      commit('connectionAdminSuccess');
    } catch (e) {
      commit('connectionFaild');
      console.error(e.stack);
    }
  },

  loginWithEmailAndPassword: async ({ commit }, { email, password }) => {
    commit('pending');
    try {
      const rep = await session.post('/auth/login', { email, password });
      this.$cookie.set('token', rep.data);
      commit('connectionSuccess');
    } catch (e) {
      console.error(e.stack);
    }
  },

  reconnect: async ({ commit }) => {
    if (cookie.get('token') != null) {
      if (jwt.decode(cookie.get('token')).admin) {
        commit('connectionAdminSuccess');
      } else commit('connectionSuccess');
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
