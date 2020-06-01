/* eslint-disable no-shadow */
import Vue from 'vue';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/no-cycle
import router from '@/router';

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
    state.loggedIn = false;
    state.admin = false;
    state.status = null;
  },
};

const actions = {

  logout: async ({ commit }) => {
    Vue.cookie.delete('token');
    commit('loggedOut');
  },

  loginAdmin: async ({ commit }, { email, password }) => {
    commit('pending');
    try {
      const rep = await session.post('/auth/login-admin', { email, password });

      // Adding token to header of the request
      Vue.cookie.set('token', rep.data);
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
      Vue.cookie.set('token', rep.data);
      commit('connectionSuccess');
    } catch (e) {
      commit('connectionFaild');
      console.error(e.stack);
    }
  },

  reconnect: async ({ commit }) => {
    if (Vue.cookie.get('token') != null) {
      if (jwt.decode(Vue.cookie.get('token')).admin) {
        commit('connectionAdminSuccess');
      } else commit('connectionSuccess');
      await router.push({ path: '/' });
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
