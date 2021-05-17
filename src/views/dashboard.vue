<template>
  <div class="home">
    <v-banner single-line>
      Create and Host your event with us !!
      <template v-slot:actions>
        <v-btn text color="red" class="white--text" @click="getMyEvent(user)">
          refresh
          <v-icon>
            mdi-refresh
          </v-icon>
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
      <v-row align="center" class="mx-0" v-if="!registeredEvents">
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
      <v-row align="end" justify="start" v-else>
        <card
          v-for="(event, i) in registeredEvents"
          :key="i"
          :event="event"
          :user="user"
          :unAttend="unAttend"
          :attend="attend"
          :save="save"
          :unSave="unSave"
        />
        <!-- <card v-for="i in 3" :key="i" /> -->
      </v-row>
      <p class="upper">
        your Saved events
      </p>
      <v-row align="center" class="mx-0" v-if="!savedEvents">
        <p>You doesn't saved any event</p>

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
      <v-row align="end" justify="start" v-else>
        <card
          v-for="(event, i) in savedEvents"
          :key="i"
          :event="event"
          :user="user"
          :unAttend="unAttend"
          :attend="attend"
          :save="save"
          :unSave="unSave"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import card from "../components/eventCard";
import axios from "axios";
export default {
  components: {
    card,
  },
  data: () => ({
    myEvent: null,
    registeredEvents: null,
    savedEvents: null,
    user: null,
  }),
  methods: {
    getMyEvent(id) {
      axios
        .get(this.$hostname + "/post/getbyuserid", {
          params: {
            id: id._id,
          },
        })
        .then((res) => {
          if (res.data.status) {
            // let od = res.data.events[0].start.split(',')
            // console.log(od);
            // let month = od[0].split('-');
            // console.log(month);
            // let time = od[1].split(':')
            // console.log(new Date(month[0], month[1], month[2], time[0], time[1]));
            this.myEvent = res.data.myEvents;
            this.registeredEvents = res.data.registeredEvents;
            this.savedEvents = res.data.savedEvents;
          } else {
            this.$vToastify.error(res.data.message);
          }
        });
    },

    attend(id) {
      if (sessionStorage.getItem("user") && sessionStorage.getItem("jwt")) {
        axios
          .put(this.$hostname + "/post/attend", id, {
            params: {
              postId: id,
            },
          })
          .then((res) => {
            if (res.data.status) {
              this.$vToastify.success(res.data.message);
              this.getMyEvent(JSON.parse(sessionStorage.getItem("user")));
            } else {
              this.$vToastify.error(res.data.message);
            }
          });
      } else {
        this.$router.push("/login");
      }
    },

    save(id) {
      if (sessionStorage.getItem("user") && sessionStorage.getItem("jwt")) {
        axios
          .put(this.$hostname + "/post/save", id, {
            params: {
              postId: id,
            },
          })
          .then((res) => {
            if (res.data.status) {
              this.$vToastify.success(res.data.message);
              this.getMyEvent(JSON.parse(sessionStorage.getItem("user")));
            } else {
              this.$vToastify.error(res.data.message);
            }
          });
      } else {
        this.$router.push("/login");
      }
    },

    unSave(id) {
      if (sessionStorage.getItem("user") && sessionStorage.getItem("jwt")) {
        axios
          .put(this.$hostname + "/post/unsave", id, {
            params: {
              postId: id,
            },
          })
          .then((res) => {
            if (res.data.status) {
              this.$vToastify.success(res.data.message);
              this.getMyEvent(JSON.parse(sessionStorage.getItem("user")));
            } else {
              this.$vToastify.error(res.data.message);
            }
          });
      } else {
        this.$router.push("/login");
      }
    },

    unAttend(id) {
      if (sessionStorage.getItem("user") && sessionStorage.getItem("jwt")) {
        axios
          .put(this.$hostname + "/post/unattend", id, {
            params: {
              postId: id,
            },
          })
          .then((res) => {
            if (res.data.status) {
              this.$vToastify.success(res.data.message);
              this.getMyEvent(JSON.parse(sessionStorage.getItem("user")));
            } else {
              this.$vToastify.error(res.data.message);
            }
          });
      } else {
        this.$router.push("/login");
      }
    },

    deleteEvent(userId, postId, image) {
      axios
        .delete(this.$hostname + "/post/delete/", {
          params: {
            userId: userId,
            postId: postId,
            image: image,
          },
        })
        .then((res) => {
          if (res.data.status) {
            this.$vToastify.success(res.data.message);
            this.getMyEvent(JSON.parse(sessionStorage.getItem("user")));
          } else {
            this.$vToastify.error(res.data.message);
          }
        });
    },
  },
  created() {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + sessionStorage.getItem("jwt");
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.getMyEvent(JSON.parse(sessionStorage.getItem("user")));
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
