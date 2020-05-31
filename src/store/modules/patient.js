/* eslint-disable no-shadow */

import { session } from '../session';


const state = {
  status: null,
  patients: [],
};

const getters = {
  getStatus: (state) => state.status,
  getPatients: (state) => state.patients,
  getSinglePatient(id, state) { return state.patients.find((p) => p.patient_id === id); },
};

const mutations = {
  pending: (state) => {
    state.status = 'pending';
  },

  errorConnectingDatabase: (state) => {
    state.status = 'DB error';
  },

  patientReceptionSuccess: (state, patients) => {
    state.patients = Array.from(patients);
    state.status = 'recieved';
  },

  patientAdditionSuccess: (state) => {
    state.status = 'added';
  },

  patientUpdateSuccess: (state) => {
    state.status = 'updated';
  },

  patientRemovalSucces: (state) => {
    state.status = 'removed';
  },
};


const actions = {

  // TODO: test requests in app

  // GET ALL PATIENTS FROM DB
  getAllPatientsFromDB: async ({ commit, rootGetters }) => {
    commit('pending');
    try {
      session.defaults.headers.common['auth-token'] = rootGetters['auth/getToken'];
      const rep = await session.get('/patient');
      commit('patientReceptionSuccess', rep.data);
    } catch (e) {
      console.log(e.response.data);
      commit('errorConnectingDatabase');
    }
  },


  // GET ONLY ONE PATIENT FROM DB
  getOnePatientFromDB: async ({ commit, rootGetters }, patientId) => {
    commit('pending');
    try {
      session.defaults.headers.common['auth-token'] = rootGetters['auth/getToken'];
      const rep = await session.get(`/patient/${patientId}`);
      commit('patientReceptionSuccess', rep.data);
    } catch (e) {
      console.log(e.response.data);
      commit('errorConnectingDatabase');
    }
  },


  // ADD ONE PATIENT TO DB
  addPatientToDB: async ({ commit, rootGetters }, patient) => {
    commit('pending');
    try {
      session.defaults.headers.common['auth-token'] = rootGetters['auth/getToken'];
      const rep = await session.post('/patient/add', patient);
      commit('patientAdditionSuccess', rep.data);
    } catch (e) {
      console.log(e.response.data);
      commit('errorConnectingDatabase');
    }
  },


  // UPDATE ONE PATIENT IN DB
  updatePatientInDB: async ({ commit, rootGetters }, patient) => {
    commit('pending');
    try {
      session.defaults.headers.common['auth-token'] = rootGetters['auth/getToken'];
      const rep = await session.put(`/patient/${patient.id}`, patient);
      commit('patientUpdateSuccess', rep.data);
    } catch (e) {
      console.log(e.response.data);
      commit('errorConnectingDatabase');
    }
  },


  // REMOVE ONE PATIENT FROM DB
  removePatientFromDB: async ({ commit, rootGetters }, patientId) => {
    commit('pending');
    try {
      session.default.headers.common['auth-token'] = rootGetters['auth/getToken'];
      await session.delete(`/patient/${patientId}`);
      commit('patientRemovalSuccess');
    } catch (e) {
      console.log(e.response.data);
      commit('errorCoonectingDatabase');
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
