<template>
  <div class="home">
    <v-banner single-line>
      Create and Host your event with us !!
      <template v-slot:actions>
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
      <p class="upper">
        your events
      </p>
      <v-row align="center" class="mx-0" v-if="!myEvent">
        <p>You doesn't create any event</p>

        <div class="grey--text ml-4">
          <v-btn
            small
            color=" white--text deep-purple darken-4"
            @click="$router.push('/create')"
          >
            Create Event
          </v-btn>
        </div>
      </v-row>

      <v-row align="end" justify="start" v-else>
        <card
          v-for="(event, i) in myEvent"
          :key="i"
          :event="event"
          :admin="true"
          :deleteEvent="deleteEvent"
        />
      </v-row>

      <p class="upper">
        Registered events
      </p>
      <v-row align="center" class="mx-0">
        <p>You doesn't register any event</p>

        <div class="grey--text ml-4">
          <v-btn
            small
            color=" white--text deep-purple darken-4"
            @click="$router.push('/')"
          >
            register for Event
          </v-btn>
        </div>
      </v-row>
      <v-row align="end" justify="start">
        <!-- <card v-for="i in 3" :key="i" /> -->
      </v-row>
    </v-container>
  </div>
</template>

<script>
import card from "../components/eventCard";
import axios from 'axios'
export default {
  components: {
    card,
  },
  data: () => ({
    myEvent: null,
    registeredEvent: null,
    user: null
  }),
  methods: {
    getMyEvent(id) {
      axios.get(this.$hostname + "/post/getbyuserid", {
        params: {
          id: id._id
        }
      }).then(res => {
        if (res.data.status) {
          let od = res.data.events[0].start.split(',')
          console.log(od);
          let month = od[0].split('-');
          console.log(month);
          let time = od[1].split(':')
          console.log(new Date(month[0], month[1], month[2], time[0], time[1]));
          this.myEvent = res.data.events
        }else {
          this.$vToastify.error(res.data.message);
        }
      })
    },
    deleteEvent(userId, postId, image){
      axios.delete(this.$hostname + "/post/delete/", {
        params: {
          userId: userId,
          postId: postId,
          image: image
        }
      }).then(res => {
        if (res.data.status) {
          this.myEvent = res.data.events
        }else {
          this.$vToastify.error(res.data.message);
        }
      })
    }
  },
  created() {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("jwt");
    this.user = JSON.parse(localStorage.getItem("user"));
    this.getMyEvent(JSON.parse(localStorage.getItem("user")));
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Langar&display=swap");

.upper {
  font-family: "Langar", cursive;
  text-transform: uppercase;
  font-size: 25px;
  color: #311b92;
}
</style>
