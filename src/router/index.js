import Vue from 'vue';
import VueRouter from 'vue-router';
import PatientList from '@/views/PatientList.vue';
import access from '@/router/access.rules';
import Login from '../views/Login.vue';
import Appointment from '../views/Appointment.vue';
import AddPatient from '../views/AddPatient.vue';
import AddAppointment from '../views/AddAppointment.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    beforeEnter: access.requiresAuth,
    name: 'Home',
    component: Appointment,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/add-session',
    beforeEnter: access.requiresAdmin,
    name: 'Add session',
    component: AddAppointment,
  },
  {
    path: '/add-patient',
    beforeEnter: access.requiresAdmin,
    name: 'Add patient',
    component: AddPatient,
  },
  {
    path: '/patients',
    beforeEnter: access.requiresAdmin,
    name: 'Liste de  patient',
    component: PatientList,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(access.requiresAuth);

export default router;
