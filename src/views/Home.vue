<template>
  <v-container>
    <v-btn v-if="!isLoggedIn" :to="'/login'">login</v-btn>
    <v-btn v-if="isLoggedIn" :to="'/add-appointment'">add appointment</v-btn>
    <v-btn v-if="isLoggedIn" :to="'/add-patient'">add patient</v-btn>
    <v-btn v-if="isLoggedIn" :to="'/appointment'">see appointments</v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  },

  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },
};
</script>
