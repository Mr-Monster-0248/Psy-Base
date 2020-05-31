import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'css.gg/icons/all.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#21a0a0',
        secondary: '#424242',
        accent: '#004777',
        error: '#e53d00',
        info: '#06aed5',
        success: '#9bc53d',
        warning: '#e53d00',
      },
    },
  },
});
