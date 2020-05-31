import Vue from 'vue';
import Vuex from 'vuex';

import authModule from './modules/auth';
import appointmentModule from './modules/appointment';
import patientModule from './modules/patient';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: authModule,
    appointment: appointmentModule,
    patient: patientModule,
  },
});
