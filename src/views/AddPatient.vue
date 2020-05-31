<template>
  <v-container>
    <PatientForm @submit="sendPatient"/>
  </v-container>
</template>

<script>
import PatientForm from '@/components/forms/PatientForm.vue';
import { mapGetters } from 'vuex';

export default {
  components: { PatientForm },

  computed: {
    ...mapGetters({
      sendStatus: 'patient/getStatus',
    }),
  },

  watch: {
    sendStatus(newState) {
      if (newState === 'added') {
        this.$swal({
          title: 'Patient ajouté à la basse de donnée',
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
    sendPatient(formData) {
      console.log(formData);
      this.$store.dispatch('patient/addPatientToDB', formData);
    },
  },
};
</script>

<style scoped>

</style>
