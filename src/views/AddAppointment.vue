/* eslint-disable vue/no-use-v-if-with-v-for */
<template>
  <v-container>
    <v-form v-model="formValid" ref="form">
      <v-container fluid>
        <v-row
          justify="center"
        >
          <div v-if="session.session_group.length > 0">
            <v-dialog v-model="dialog" persistent max-width="350">
              <v-card>
                <v-card-title class="headline">Enregistrement de RDV</v-card-title>
                <v-card-text>
                  <p>Rendez-vous avec :</p>
                  <ul>
                    <li
                      v-for="p in session.session_group.filter(_ => _ != null)"
                      :key="p"
                    >
                      <strong>{{patientsList[p-1].text}}</strong>
                    </li>
                  </ul>
                  <p class="pt-4">
                    Le <strong>{{normalizeDate('/')}}</strong> à <strong>{{time}}</strong>.
                  </p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                  color="red darken-1 white--text"
                  @click="confirmation(false)"
                  >Annuler</v-btn>

                  <v-btn
                    color="green darken-1 white--text"
                    @click="validateAppointment"
                    :loading="isPending"
                  >Confirmer</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-snackbar
              v-model="snackbar"
              top
            >
              {{confirmed ? 'Rendez-vous enregistré.' : 'Le RDV n\'a pas été enregistré.'}}
              <v-btn
                color="pink"
                text
                @click="closeSnackbar()"
              >
                Fermer
              </v-btn>
            </v-snackbar>
          </div>

          <v-col
            sm="6"
          >
            <v-autocomplete
              v-model="session.session_group"
              :items="patientsList"
              label="Choose a patient"
              multiple
              :rules="autoRules"
              :loading="!isRecieved"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row
          justify="center"
        >
          <v-col
            sm="3"
          >
            <v-date-picker
              v-model="date"
              scrollable
              color="green"
              :show-current="true"
              :allowed-dates="allowedDates"
              :rules="dateRules"
              :disabled="session.session_group.length === 0"
              :first-day-of-week="1"
              locale-first-day-of-year="fr"
              locale="fr"
              :events="sessionDates"
            >
            </v-date-picker>
          </v-col>

          <v-col
            sm="3"
          >
            <v-time-picker
              v-model="time"
              format="24hr"
              color="green"
              :rules="timeRules"
              full-width
              :disabled="date === null"
              min="08:00"
              max="17:00"
            >
            </v-time-picker>
          </v-col>
        </v-row>

        <v-row
          justify="center"
        >
          <v-col
            sm="6"
          >
            <h3 class='pb-4'>
              <strong>
                Détails du RDV :
              </strong>
            </h3>

            <div>
              <div v-if="session.session_group.length === 0">
                <p>
                  Aucun patient sélectionné.
                </p>
              </div>
              <div v-else>
                <p>
                  Patient(s) sélectionné(s) :
                  <ul>
                    <li
                      v-for="p in session.session_group.filter(_ => _ != null)"
                      :key="p"
                    >
                      <strong>{{patientsList[p-1].text}}</strong>
                    </li>
                  </ul>
                </p>
              </div>
            </div>

            <div>
              <div v-if="date === null">
                <p>
                  Aucune date sélectionnée.
                </p>
              </div>
              <div v-else>
                <p>
                  Date sélectionnée : <strong>{{normalizeDate('/')}}</strong>.
                </p>
              </div>
            </div>

            <div>
              <div v-if="time === null">
                <p>
                  Aucun horaire sélectionné.
                </p>
              </div>
              <div v-else>
                <p>
                  Horaire sélectionné : <strong>{{time}}</strong>.
                </p>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row
          justify="center"
        >
          <v-col
            sm="2"
          >
            <v-btn
              block
              color="green"
              class="white--text"
              :disabled="session.session_group.length > 3"
              :loading="dialog"
              @click="confirmAppointment()"
            >
              Confirm Appointment
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AddAppointment',

  data: () => ({
    formValid: false,
    session: {
      session_group: [],
      date_time: '',
      duration: '00:30',
    },


    autoRules: [
      (s) => s.length <= 3 || 'You can only select 3 patients maximum at a time.',
    ],

    date: null,
    dateRules: [
      (d) => !!d || 'You must pick a valid date for the appointment.',
    ],

    time: null,
    timeRules: [
      (t) => !!t || 'You must pick a valid time for the appointment.',
    ],


    disab: false,
    dialog: false,
    snackbar: false,


    confirmed: false,
  }),

  methods: {
    allowedDates(val) {
      return val >= new Date().toISOString().substr(0, 10);
    },

    normalizeDate(token) {
      return this.date === null ? null : `${this.date.split('-')[2]}${token}${this.date.split('-')[1]}${token}${this.date.split('-')[0]}`;
    },

    normalizeDateAgain(date, token) {
      return `${date.split('-')[2]}${token}${date.split('-')[1]}${token}${date.split('-')[0]}`;
    },

    confirmAppointment() {
      this.disab = true;
      this.dialog = true;
    },

    confirmation(conf) {
      this.confirmed = conf;
      this.dialog = false;
      this.snackbar = true;
      this.disab = false;
    },

    validateAppointment() {
      this.session.date_time = `${this.normalizeDate('-')}_${this.time}`;
      console.log(this.session);


      while (this.session.session_group.length < 3) {
        this.session.session_group.push(null);
      }

      console.log(this.session);
      this.$store.dispatch('appointment/sendNewSessionToDatabase', this.session);
      // this.$refs.form.reset();

      this.confirmation(true);
    },

    closeSnackbar() {
      this.snackbar = false;
      this.confirmed = false;
    },
  },

  computed: {
    ...mapGetters({
      isPending: 'appointment/isPending',
      isRecorded: 'appointment/isRecorded',
      isAppRecieved: 'appointment/isReceived',
      isRecieved: 'patient/isRecieved',
      getAppointments: 'appointment/getAppointment',
    }),

    patientsList() {
      if (this.$store.getters['patient/isRecieved']) {
        return this.$store.getters['patient/getPatients'].map((p) => ({
          value: p.patient_id,
          text: `${p.first_name} ${p.last_name}, ${p.date_of_birth.split('-')[2]}/${p.date_of_birth.split('-')[1]}/${p.date_of_birth.split('-')[0]}`,
        }));
      }
      return [];
    },

    sessionsList() {
      if (this.isAppRecieved) {
        return this.$store.getters['appointment/getAppointments'].map((a) => ({
          date: `${this.normalizeDateAgain(a.date_and_time.split('_')[0], '-')}`,
          time: `${a.date_and_time.split('_')[1]}`,
        }));
      }
      return [];
    },

    sessionDates() {
      const evts = [];

      for (let i = 0; i < this.sessionsList.length; i += 1) {
        if (!evts.includes(this.sessionsList[i].date)) {
          evts.push(this.sessionsList[i].date);
        }
      }

      return evts;
    },
  },

  mounted() {
    this.$store.dispatch('patient/getAllPatientsFromDB');
    this.$store.dispatch('appointment/getAllSessionFromDB');
  },
};
</script>
