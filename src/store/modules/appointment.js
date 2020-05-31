/* eslint-disable no-shadow */

import { session } from '../session';


const state = {
  status: null,
  dataRecorded: false,
  appointments: [],
};

const getters = {
  isPending: (state) => state.status === 'pending',
  isRecorded: (state) => state.status === 'recorded',
  isReceived: (state) => state.status === 'received',
  isUpdated: (state) => state.status === 'updated',
  getStatus: (state) => state.status,
  getAppointments: (state) => state.appointments,
};

const mutations = {
  pending: (state) => {
    state.status = 'pending';
  },

  errorConnectingDatabase: (state) => {
    state.status = 'DB error';
  },

  sessionAdditionSuccess: (state) => {
    state.status = 'recorded';
  },

  sessionDeleteSuccess: (state) => {
    state.status = 'deleted';
  },

  sessionRetrievalSuccess: (state, appointments) => {
    state.status = 'received';
    state.appointments = appointments;
  },

  sessionUpdateSuccess: (state) => {
    state.status = 'updated';
  },
};

const actions = {

  // ADD NEW SESSION TO DATABASE
  sendNewSessionToDatabase: async ({ commit, rootGetters }, sessionData) => {
    commit('pending');
    try {
      session.defaults.headers.common['auth-token'] = rootGetters['auth/getToken'];
      console.log(sessionData);
      const rep = await session.post('/session/add', sessionData);
      commit('sessionAdditionSuccess', rep.data);
    } catch (e) {
      console.log(e.response.data);
      commit('errorConnectingDatabase');
      // console.error(e);
    }
  },

  // GET ALL SESSIONS FROM DATABASE
  getAllSessionFromDB: async ({ commit, rootGetters }) => {
    commit('pending');
    try {
      session.defaults.headers.common['auth-token'] = rootGetters['auth/getToken'];
      const rep = await session.get('/session');
      commit('sessionRetrievalSuccess', rep.data);
    } catch (e) {
      console.log(e.response.data);
      commit('errorConnectingDatabase');
      // console.error(e);
    }
  },

  // GET SINGLE SESSIONS FROM DATABASE
  getSingleSessionFromDB: async ({ commit, rootGetters }, sessionId) => {
    commit('pending');
    try {
      session.defaults.headers.common['auth-token'] = rootGetters['auth/getToken'];
      const rep = await session.get(`/session/${sessionId}`);
      commit('sessionRetrievalSuccess', rep.data);
    } catch (e) {
      console.log(e.response.data);
      commit('errorConnectingDatabase');
      // console.error(e);
    }
  },

  // UPDATE A SESSION IN DB
  updateSessionInDB: async ({ commit, rootGetters }, { id, sessionData }) => {
    commit('pending');
    try {
      session.defaults.headers.common['auth-token'] = rootGetters['auth/getToken'];
      const rep = await session.patch(`/session/${id}`, sessionData);
      commit('sessionUpdateSuccess', rep.data);
    } catch (e) {
      console.log(e.response.data);
      commit('errorConnectingDatabase');
      // console.error(e);
    }
  },

  deleteSessionInDB: async ({ commit, rootGetters }, id) => {
    commit('pending');
    try {
      session.defaults.headers.common['auth-token'] = rootGetters['auth/getToken'];
      await session.delete(`/session/${id}`);
      commit('sessionDeleteSuccess');
    } catch (e) {
      console.log(e.response.data);
      commit('errorConnectingDatabase');
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
