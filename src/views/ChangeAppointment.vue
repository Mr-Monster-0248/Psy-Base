/* eslint-disable vue/no-use-v-if-with-v-for */
<template>
  <v-container>
    <SessionForm modify @submit="addSession"/>
  </v-container>
</template>

<script>
import SessionForm from '@/components/forms/SessionForm.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'ChangeAppointment',
  components: {
    SessionForm,
  },

  computed: {
    ...mapGetters({
      sendStatus: 'appointment/getStatus',
    }),
  },

  watch: {
    sendStatus(newState) {
      if (newState === 'recorded') {
        this.$swal({
          title: 'Séance bien enregistrée',
          icon: 'success',
        });
      } else {
        this.$swal({
          title: 'Une erreur est survenue pendant l\'envoie',
          text: 'Réessayer plus tard',
          icon: 'error',
        });
      }
    },
  },

  methods: {
    addSession(formData) {
      this.$store.dispatch('appointment/sendNewSessionToDatabase', formData);
    },
  },

  mounted() {
    this.$store.dispatch('patient/getAllPatientsFromDB');
  },
};
</script>
