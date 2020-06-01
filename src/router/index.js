import Vue from 'vue';
import VueRouter from 'vue-router';
import PatientList from '@/views/PatientList.vue';
// eslint-disable-next-line import/no-cycle
import access from '@/router/access.rules';
import ChangeAppointment from '@/views/ChangeAppointment.vue';
import Info from '../views/Info.vue';
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
    path: '/alter-session/:id',
    name: 'Change session',
    component: ChangeAppointment,
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
  {
    path: '/info',
    name: 'Information patient',
    component: Info,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(access.requiresAuth);

export default router;
