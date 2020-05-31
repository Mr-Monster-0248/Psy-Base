<template>
  <v-app>
    <Appbar/>
    <Navbar/>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Appbar from '@/components/Appbar.vue';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Appbar,
    Navbar,
  },

  data: () => ({
    //
  }),
};
</script>
