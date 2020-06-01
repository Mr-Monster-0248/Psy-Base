<template>
  <v-form v-model="formValid" ref="patientForm" @submit.prevent="addPatient">
    <v-row>
      <v-col>
        <v-text-field
          v-model="firstName"
          outlined
          :rules="rules"
          label="Prénom"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="lastName"
          outlined
          :rules="rules"
          label="Nom de famille"
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
              :rules="rules"
              outlined
              label="Date de naissance"
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
          outlined
          :rules="rules"
          label="Email"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="address"
          outlined
          :rules="rules"
          label="Adresse"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="gender"
          :rules="specialRules"
          outlined
          :items="genders"
          label="Genre"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="ageCategory"
          :rules="specialRules"
          :items="ageCategories"
          outlined
          label="Catégorie d'âge"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="discovery"
          :rules="rules"
          :items="discoveryChoices"
          outlined
          label="Comment le patient a connu le cabinet"
        />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col sm="4">
        <v-btn
          type="submit"
          :disabled="!formValid"
          block color="green"
          class="white--text">
          {{ this.modify ? 'Modifer vos information' : 'Ajouter un patient' }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  name: 'PatientForm',

  props: {
    modify: {
      type: Boolean,
      default: false,
    },
    patient: {
      type: Object,
    },
  },

  data: () => ({
    formValid: false,
    rules: [(v) => !!v || 'Ce champ est obligatoire'],
    specialRules: [(v) => (v >= 0 || !!v) || 'Ce champ est obligatoire'],

    menu: null,
    firstName: '',
    lastName: '',
    address: '',
    password: 'Azerty1234!', // default password
    email: '',
    birthday: '',
    gender: null,
    genders: [
      { text: 'Homme', value: 0 },
      { text: 'Femme', value: 1 },
      { text: 'Autre', value: 3 },
    ],
    discovery: null,
    discoveryChoices: [
      { text: 'Bouche à oreille', value: 1 },
      { text: 'Les pages jaunes', value: 2 },
      { text: 'Internet', value: 3 },
      { text: 'Publicité', value: 4 },
    ],
    ageCategory: null,
    ageCategories: [
      { text: 'Enfant (5-12)', value: 0 },
      { text: 'Adolescent (13-19)', value: 1 },
      { text: 'Adulte (20-59)', value: 2 },
      { text: 'Senior (60+)', value: 3 },
    ],
  }),

  computed: {
    goodDate() { return this.birthday.split('-').reverse().join('-'); },
  },

  methods: {
    addPatient() {
      const patientFormData = {
        last_name: this.lastName,
        first_name: this.firstName,
        date_of_birth: this.goodDate,
        address: this.address,
        email: this.email,
        password: 'Azerty_1234!',
        gender: this.gender,
        age_category: this.ageCategory,
        discovery_id_fk: this.discovery,
      };

      this.$emit('submit', patientFormData);
      this.$refs.patientForm.reset();
    },
  },
};

</script>

<style scoped>

</style>
