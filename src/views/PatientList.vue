<template>
  <v-container>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="patients"
      item-key="patient_id"
      show-select
      single-select
    >
      <template v-slot:header.data-table-select>
        <v-btn
          :disabled="selected.length === 0"
          icon
          @click="deleteSelection"
          color="warning" >
          <i class="gg-trash"></i>
        </v-btn>
      </template>
    </v-data-table>


  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PatientList',

  data: () => ({
    selected: [],
    headers: [
      { text: 'ID', value: 'patient_id' },
      { text: 'Nom', value: 'last_name' },
      { text: 'Prénom', value: 'first_name' },
      { text: 'Date de naissance', value: 'date_of_birth' },
    ],
  }),

  computed: {
    ...mapGetters({
      patients: 'patient/getPatients',
      sendStatus: 'patient/getStatus',
    }),
  },

  watch: {
    sendStatus(newState) {
      if (newState === 'removed') {
        this.$swal({
          title: 'Patient supprimé de la basse de donnée',
          icon: 'success',
        });
        this.$store.dispatch('patient/getAllPatientsFromDB');
      } else if (newState === 'DB error') {
        this.$swal({
          title: 'Une erreur est survenue pendant l\'envoie',
          text: 'Réessayer plus tard',
          icon: 'error',
        });
      }
    },
  },

  methods: {
    deleteSelection() {
      console.log(this.selected);
      this.$swal({
        title: 'Continuer la suppression du patient ?',
        dangerMode: true,
        buttons: {
          cancel: {
            text: 'Finalement non',
            value: false,
          },
          accept: {
            text: 'Oui',
            value: true,
          },
        },
      }).then((valid) => {
        if (valid) {
          this.$store.dispatch('patient/removePatientFromDB', this.selected.patient_id);
        }
      });
    },
  },

  mounted() {
    this.$store.dispatch('patient/getAllPatientsFromDB');
  },
};
</script>
