<template>
  <v-container>
    <v-snackbar
      v-model="snackbar"
      top
    >
      {{ isAdded ? 'The patient has been added.' : 'The patient was not added.' }}
      <v-btn
        color="pink"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

    <v-form v-model="formValid" ref="patientForm" @submit.prevent="addPatient">
      <v-row>
        <v-col>
          <v-text-field
            v-model="firstName"
            :rules="rules"
            label="First Name"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="lastName"
            :rules="rules"
            label="Last Name"
          />
        </v-col>
        <v-col>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="birthday"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="birthday"
                label="Birthday date"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="birthday" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(birthday)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="email"
            :rules="rules"
            label="Email"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="address"
            :rules="rules"
            label="Address"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            v-model="gender"
            :items="genders"
            label="Gender"
          />
        </v-col>
        <v-col>
          <v-select
            v-model="ageCategory"
            :items="ageCategories"
            label="Age category"
          />
        </v-col>
        <v-col>
          <v-select
            v-model="discovery"
            :items="discoveryChoices"
            label="How did the patient discover the office"
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col sm="4">
          <v-btn type="submit" block color="green" class="white--text">Add patient</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AddPatient',
  data: () => ({
    formValid: false,
    rules: [(v) => !!v],

    menu: null,
    firstName: '',
    lastName: '',
    address: '',
    password: 'Azerty1234!', // default password
    email: '',
    birthday: '',
    gender: null,
    genders: [
      { text: 'Male', value: 0 },
      { text: 'Female', value: 1 },
      { text: 'Whatever...', value: 3 },
    ],
    discovery: null,
    discoveryChoices: [
      { text: 'Mouth to ear', value: 1 },
      { text: 'Yellow pages', value: 2 },
      { text: 'Internet', value: 3 },
      { text: 'Advertisement', value: 4 },
    ],
    ageCategory: null,
    ageCategories: [
      { text: 'Child (5-12)', value: 0 },
      { text: 'Teen (13-19)', value: 1 },
      { text: 'Adult (20-59)', value: 2 },
      { text: 'Senior (60+)', value: 3 },
    ],

    snackbar: false,
  }),

  computed: {
    ...mapGetters({
      isAdded: 'patient/isAdded',
    }),
  },

  methods: {
    addPatient() {
      this.$store.dispatch('patient/addPatientToDB', {
        last_name: this.lastName,
        first_name: this.firstName,
        date_of_birth: this.normalizeDate(this.birthday, '-'),
        address: this.address,
        email: this.email,
        password: 'Azerty_1234!',
        gender: this.gender,
        age_category: this.ageCategory,
        discovery_id_fk: this.discovery,
      });

      this.$refs.form.reset();
      this.snackbar = true;
    },

    normalizeDate(date, token) {
      return `${date.split('-')[2]}${token}${date.split('-')[1]}${token}${date.split('-')[0]}`;
    },
  },
};
</script>

<style scoped>

</style>
