<template>
  <v-app>
    <Appbar/>
    <Navbar v-if="this.$route.path !== '/login'"/>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Appbar from '@/components/Appbar.vue';
import Navbar from '@/components/Navbar.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Appbar,
    Navbar,
  },

  watch: {
    isLoggedIn(newState) {
      if (!newState) this.$router.push('/login');
    },
  },

  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },

  beforeMount() {
    this.$store.dispatch('auth/reconnect');
  },
};
</script>
