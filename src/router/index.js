import Vue from 'vue';
import VueRouter from 'vue-router';
import PatientList from '@/views/PatientList.vue';
import Login from '../views/Login.vue';
import Appointment from '../views/Appointment.vue';
import AddPatient from '../views/AddPatient.vue';
import AddAppointment from '../views/AddAppointment.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
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
    name: 'Add session',
    component: AddAppointment,
  },
  {
    path: '/add-patient',
    name: 'Add patient',
    component: AddPatient,
  },
  {
    path: '/patients',
    name: 'Liste de  patient',
    component: PatientList,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
