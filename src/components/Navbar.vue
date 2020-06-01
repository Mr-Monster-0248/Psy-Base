<template>
  <v-navigation-drawer
      color="info"
      dark
      app
      clipped
      permanent
    >
      <v-list>
        <v-list-item
          v-for="item in navAccording"
          :key="item.title"
          link
          :to="item.to"
        >
          <v-list-item-icon>
            <i :class="item.icon"></i>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            :color="isLoggedIn ? 'secondary' : 'accent'"
            @click="actionBtn"
            block
          >{{ isLoggedIn ? 'Logout' : 'Login' }}</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Navbar',
  data: () => ({
    items: [
      {
        title: 'Calendrier',
        icon: 'gg-calendar',
        to: '/',
        for: 'all',
      },
      {
        title: 'Ajouter une séance',
        icon: 'gg-add',
        to: '/add-session',
        for: 'admin',
      },
      {
        title: 'Ajouter un patient',
        icon: 'gg-user-add',
        to: '/add-patient',
        for: 'admin',
      },
      {
        title: 'Liste de patient',
        icon: 'gg-user-list',
        to: '/patients',
        for: 'admin',
      },
      {
        title: 'Information personnel',
        icon: 'gg-info',
        to: '/info',
        for: 'patient',
      },
    ],
  }),

  methods: {
    actionBtn() {
      if (this.isLoggedIn) this.$store.dispatch('auth/logout');
      this.$router.push('/login').catch(() => null);
    },
  },

  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      admin: 'auth/isAdmin',
    }),

    navAccording() {
      if (this.admin) {
        return this.items.filter((el) => el.for === 'admin' || el.for === 'all');
      }
      return this.items.filter((el) => el.for === 'patient' || el.for === 'all');
    },
  },
};
</script>

<style>

</style>
