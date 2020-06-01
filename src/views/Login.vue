<template>
  <v-container class="fill-height">
  <v-container>
    <v-row>
      <v-col cols="12"><h1 class="text-center mb-10">Login</h1></v-col>
    </v-row>
    <v-form v-model="formValid" ref="loginform" @submit.prevent="connect">
      <v-row justify="center">
        <v-col cols="5">
          <v-text-field
            v-model="email"
            :rules="rules"
            prepend-icon="fas fa-envelope"
            hint="Your email address"
            placeholder="Email Address"
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="5">
          <v-text-field
            v-model="password"
            :rules="rules"
            type="password"
            prepend-icon="fas fa-lock"
            hint="Your password"
            placeholder="Password"
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="3">
          <v-btn
            block
            color="primary"
            :disabled="!formValid"
            :loading="isPending"
            type="submit">
            Connect
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Login',
  data: () => ({
    formValid: false,

    rules: [(v) => !!v],

    email: '',
    password: '',
  }),

  computed: {
    ...mapGetters({
      isPending: 'auth/isPending',
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },

  watch: {
    isLoggedIn(newState) {
      if (newState) this.$router.push('/');
    },
  },

  methods: {
    connect() {
      const loginData = {
        email: this.email,
        password: this.password,
      };

      if (/([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})/.test(loginData.email)) {
        this.$store.dispatch('auth/loginWithEmailAndPassword', loginData);
      } else {
        this.$store.dispatch('auth/loginAdmin', loginData);
      }
    },
  },
};
</script>

<style scoped>

</style>
