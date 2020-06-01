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
      } else if (newState === 'not auth removal') {
        this.$swal({
          title: 'Vous ne pouvez pas supprimer ce patient',
          text: 'Il fait partie de séances, supprimez d\'abord ses séances',
          icon: 'warning',
        });
      } else if (newState === 'DB error') {
        this.$swal({
          title: 'Une erreur est survenue',
          text: 'Réessayez plus tard',
          icon: 'error',
        });
      }
    },
  },

  methods: {
    deleteSelection() {
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
          this.$store.dispatch('patient/removePatientFromDB', this.selected[0].patient_id);
        }
      });
    },
  },

  mounted() {
    this.$store.dispatch('patient/getAllPatientsFromDB');
  },
};
</script>
