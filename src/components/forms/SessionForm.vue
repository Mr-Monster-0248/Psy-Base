<template>
  <v-form v-model="formValid" ref="sessionForm" @submit.prevent="sendForm">
    <v-row>
      <v-col>
        <v-autocomplete
            v-model="selectedPatient"
            :items="allPatient"
            :rules="patientSelect"
            outlined
            chips
            small-chips
            label="Sélectionnez jusqu'à trois patients"
            multiple
          ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-menu
          ref="menuDate"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          max-width="500px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field

              :value="dateWellForm"
              :rules="noEmpty"
              label="Date de la séance"
              readonly
              outlined
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            :value="(d) => d.split('-').reverse().join('-')"
            :min="modify ? null : new Date().toISOString().substr(0, 10)"
            :rules="noEmpty"
            landscape
            locale-first-day-of-year="fr"
            locale="fr"
            first-day-of-week="1"
            @click:date="$refs.menuDate.save(date)"
            full-width/>
        </v-menu>
      </v-col>
      <v-col>
        <v-menu
          ref="menu"
          v-model="menu2"
          :close-on-content-click="false"
          :return-value.sync="time"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="time"
              :rules="noEmpty"
              label="Heure de la séance"
              readonly
              outlined
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menu2"
            v-model="time"
            :rules="noEmpty"
            landscape
            format="24hr"
            min="08:00"
            max="17:30"
            @click:minute="$refs.menu.save(time)"
            full-width/>
        </v-menu>
      </v-col>
    </v-row>
    <v-row v-if="modify">

    </v-row>
    <v-row justify='center'>
      <v-col cols='5'>
        <v-btn
          type="submit"
          color="primary"
          :disabled="!formValid"
          block>
          {{ btnText }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    modify: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    formValid: false,
    menu1: null,
    menu2: null,
    date: '',
    time: '',

    selectedPatient: [],

    patientSelect: [
      (s) => s.length > 0 || 'Ce champs doit être rempli',
      (s) => s.length <= 3 || 'Pas plus de 3 patients par séance',
    ],
    noEmpty: [
      (s) => s !== '' || 'Ce champs doit être rempli',
    ],
  }),

  mounted() {
    if (this.modify) {
      const session = this.$store.getters['appointment/getAppointments']
        .filter((s) => s.session_id === Number(this.$route.params.id))[0];
      console.log(session);

      this.selectedPatient = session.patients.map((p) => (p != null ? p.patient_id : null));
      this.date = session.date_and_time.split('_')[0]
        .split('-').reverse().join('-');
      // eslint-disable-next-line prefer-destructuring
      this.time = session.date_and_time.split('_')[1];
    }
  },

  computed: {
    dateWellForm() {
      return this.date.split('-').reverse().join('-');
    },

    btnText() {
      return this.modify ? 'Modifier la séance' : 'Ajouter une séance';
    },

    ...mapGetters({
      getPatients: 'patient/getPatients',
    }),

    allPatient() {
      return this.getPatients.map((pat) => ({
        text: `${pat.first_name} ${pat.last_name} - (${pat.date_of_birth})`,
        value: pat.patient_id,
      }));
    },
  },

  methods: {
    sendForm() {
      this.$swal({
        title: 'Confirmer l\'ajout de la session ?',
        icon: 'warning',
        buttons: ['Pas tout de suite', 'Confirmer'],
      }).then((confirm) => {
        if (confirm) {
          const sessionData = {
            session_group: this.selectedPatient,
            date_time: [this.dateWellForm, this.time].join('_'),
            duration: '00:30',
          };
          while (sessionData.session_group.length < 3) sessionData.session_group.push(null);

          // console.log(sessionData);
          this.$emit('submit', sessionData);
          this.$refs.sessionForm.reset();
        }
      });
    },
  },
};
</script>

<style>

</style>
