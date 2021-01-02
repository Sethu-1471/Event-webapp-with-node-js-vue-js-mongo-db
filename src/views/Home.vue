<template>
  <div>
    <v-banner single-line>
      Create and Host your event with us !!
      <template v-slot:actions>
        <v-btn color="deep-purple darken-4" dark @click="sheet = !sheet">
          Filter
        </v-btn>
        <v-btn
          text
          color="deep-purple darken-4"
          @click="$router.push('/create')"
        >
          Create Event
        </v-btn>
      </template>
    </v-banner>
    <v-container fluid>
      <v-row align="end" justify="start">
        <card v-for="(event, i) in events" :key="i" :event="event" />
      </v-row>
    </v-container>
    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="200px">
        <v-btn class="mt-6" text color="red" @click="sheet = !sheet">
          close
        </v-btn>
        <div class="py-3">
          This is a bottom sheet using the controlled by v-model instead of
          activator
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import card from "../components/eventCard";
import axios from "axios"
export default {
  components: {
    card,
  },
  data: () => ({
    sheet: false,
    events: null,
  }),
  mounted() {
    this.getPost()
  },
  methods: {
    getPost() {
      axios.get(this.$hostname + "/post/getbypublic").then(res => {
        if (res.data.status) {
          this.events = res.data.events
        }else {
          this.$vToastify.error(res.data.message);
        }
      })
    }
  }
};
</script>

<style></style>
