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
        > {{ event.start  }} </span
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
      <v-btn v-if="!admin" :disabled="!event.registration" color="deep-purple darken-5" text>
        {{ event.registration ? "Attend" : "Registration closed" }}
      </v-btn>
      <v-btn v-if="admin" color="deep-purple darken-5" class="white--text" small @click="$router.push('/edit/' + event._id)">
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
  props: [ "event", "admin", "deleteEvent" ]
};
</script>

<style>

</style>
