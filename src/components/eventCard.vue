<template>
  <v-card class="my-4 mx-4" style="border-radius: 5px" max-width="350" min-width="350">
    <v-img
      height="150"
      :src=" $hostname +  '/images/' + event.image"
    ></v-img><v-divider></v-divider>

    <v-card-title> {{ event.name }} </v-card-title>

    <v-card-text>
      <div>
        <v-icon class="mr-2" small color="green">
        mdi-clock-outline
      </v-icon>
      <span class="caption grey--text font-weight-light"
        > {{ event.start.split(",")[0] }}, {{ tConvert(event.start.split(",")[1]) }} </span
      >
      </div><div>
        <v-icon class="mr-2" small color="green">
        mdi-restore
      </v-icon>
      <span class="caption grey--text font-weight-light"
        >Mode: {{ event.mode ? "Online" : "Offline"  }} </span
      >
      </div>
      <div v-if="admin">
        <v-icon class="mr-2" small :color="`${event.public ? 'green' : 'red'}`">
        mdi-earth
      </v-icon>
      <span class="caption grey--text font-weight-light"
        >Privacy: {{ event.public ? "Public" : "Only me"  }} </span
      >
      </div>
      <div v-if="admin">
        <v-icon class="mr-2" small :color="`${event.registration ? 'green' : 'red'}`">
        mdi-account-multiple-plus
      </v-icon>
      <span class="caption grey--text font-weight-light"
        >Registration: {{ event.registration ? "Open" : "Closed"  }} </span
      >
      </div>
    </v-card-text>
    <v-divider class="mx-4"></v-divider>
    <v-card-actions>
      <v-btn v-if="!admin" small :disabled="!event.registration" color="deep-purple darken-4" text>
        {{ event.registration ? "Attend" : "Registration closed" }}
      </v-btn>
      <v-btn v-if="admin" color="deep-purple darken-4" class="white--text" small @click="$router.push('/edit/' + event._id)">
        Edit
      </v-btn>
      <v-btn v-if="admin" color="red" small class="white--text" text @click="deleteEvent( event.createdBy._id ,event._id, event.image)">
        delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: [ "event", "admin", "deleteEvent" ],
  methods: {
    tConvert(time) {
      // Check correct time format and split into components
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join(""); // return adjusted time or original string
    },
  }
};
</script>

<style>

</style>
