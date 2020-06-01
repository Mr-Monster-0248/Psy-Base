import Vue from 'vue';
import VueSwal from 'vue-swal';
import VueCookie from 'vue-cookie';

import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;
Vue.use(VueSwal);
Vue.use(VueCookie);

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
// eslint-disable-next-line no-unused-vars
Vue.config.warnHandler = (msg, vm, trace) => {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    // eslint-disable-next-line no-param-reassign
    msg = null;
    // eslint-disable-next-line no-param-reassign
    vm = null;
    // eslint-disable-next-line no-param-reassign
    trace = null;
  }
};

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
