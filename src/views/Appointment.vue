<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
              Today
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>

            <v-toolbar-title>{{ title }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn
                  outlined
                  color="grey darken-2"
                  v-on="on"
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>

        <v-sheet height="700">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="green"
            :events="sessionsList"
            :event-color="selectedEvent.color"
            :now="today"
            :type="type"
            :short-weekdays="false"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            :first-interval="8"
            :interval-minutes="60"
            :interval-count="12"
            :short-intervals="false"
            local="fr"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>

          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="selectedEvent.color"
                dark
              >
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon :to="`/change-appointment/${this.selectedEvent.id}`">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>fas fa-trash-alt</v-icon>
                </v-btn>
              </v-toolbar>

              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Appointment',
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    today: new Date().toISOString().substring(0, 10),
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    testEvents: [
      {
        id: 1,
        name: 'J. Doe',
        start: '2020-05-30 12:00',
        end: '2020-05-30 12:30',
        details: 'John Doe - 12:00 to 12:30',
        color: 'primary',
      },
    ],
    colors: ['primary'],
    names: ['Session'],
  }),

  computed: {
    ...mapGetters({
      isReceived: 'appointment/isReceived',
    }),

    sessionsList() {
      if (this.$store.getters['appointment/isReceived']) {
        const list = this.$store.getters['appointment/getAppointments'].map((a) => ({
          id: a.session_id,
          name: this.sessName(a.patients),
          start: `${this.normalizeDate(a.date_and_time.split('_')[0], '-')} ${a.date_and_time.split('_')[1]}`,
          end: `${this.normalizeDate(a.date_and_time.split('_')[0], '-')} ${this.endTime(a.date_and_time.split('_')[1])}`,
          details: '',
          color: 'primary',
        }));

        for (let i = 0; i < list.length; i += 1) {
          list[i].details = `${list[i].name} - ${list[i].start.split(' ')[1]} to ${list[i].end.split(' ')[1]}`;
        }

        return list;
      }
      return [];
    },

    title() {
      const { start, end } = this;
      if (!start || !end) {
        return '';
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? '' : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? '' : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`;

        case 'week':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;

        case 'day':
          return `${startMonth} ${startDay} ${startYear}`;

        default:
      }
      return '';
    },

    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      });
    },
  },

  methods: {
    normalizeDate(date, token) {
      return `${date.split('-')[2]}${token}${date.split('-')[1]}${token}${date.split('-')[0]}`;
    },

    endTime: (time) => {
      let hr = parseInt(time.split(':')[0], 10);
      let mn = parseInt(time.split(':')[1], 10);

      mn += 30;

      if (mn >= 60) {
        mn -= 60;
        hr += 1;
      }

      return `${hr}:${mn}`;
    },

    sessName(p) {
      let name = '';

      for (let i = 0; i < p.length; i += 1) {
        if (p[i] !== null) {
          name += this.patName(p[i]);
        }
      }

      return name;
    },

    patName: (p) => `${p.first_name} ${p.last_name}`,


    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i += 1) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: this.formatDate(first, !allDay),
          end: this.formatDate(second, !allDay),
          color: this.colors[this.rnd(0, this.colors.length - 1)],
        });
      }

      this.start = start;
      this.end = end;
      this.events = events;
    },
    nth(d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    },
  },

  mounted() {
    this.$store.dispatch('patient/getAllPatientsFromDB');
    this.$store.dispatch('appointment/getAllSessionFromDB');
    this.$refs.calendar.checkChange();
  },
};
</script>

<style scoped>

</style>
