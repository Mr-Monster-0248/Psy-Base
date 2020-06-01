<template>
  <v-app-bar app color="primary" dark clipped-left>
    <v-btn icon @click="go">
      <v-img contain height="45px" src="../assets/logo.svg"/>
    </v-btn>

    <v-toolbar-title>
      Psy-Base
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  methods: {
    go() {
      this.$router.push('/').catch(() => null);
    },
  },
};
</script>

<style>

</style>
