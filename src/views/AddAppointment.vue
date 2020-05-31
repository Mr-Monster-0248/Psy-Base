/* eslint-disable vue/no-use-v-if-with-v-for */
<template>
  <v-container>
    <SessionForm @submit="addSession"/>
  </v-container>
</template>

<script>
import SessionForm from '@/components/forms/SessionForm.vue';

export default {
  name: 'AddAppointment',
  components: {
    SessionForm,
  },

  methods: {
    addSession(formData) {
      console.log(formData);
    },
  },

  mounted() {
    this.$store.dispatch('patient/getAllPatientsFromDB');
    // this.$store.dispatch('appointment/getAllSessionFromDB');
  },
};
</script>
