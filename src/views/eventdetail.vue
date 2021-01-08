<template>
  <div>
    <v-banner single-line>
      Create and Host your event with us !!
      <template v-slot:actions>
        <v-btn color="red" class="white--text" @click="$router.go(-1)">
          back
        </v-btn>
        <v-btn
          v-if="event"
          color="deep-purple darken-4"
          class="white--text"
          :disabled="!event.registration"
          @click="
            event.registration
              ? user
                ? event.participants.find((item) => item.user == user._id)
                  ? unAttend(event._id)
                  : attend(event._id)
                : attend(event._id)
              : null
          "
        >
          {{
            event.registration
              ? user
                ? event.participants.find((item) => item.user == user._id)
                  ? "UnEnroll"
                  : "Enroll"
                : "Enroll"
              : "Registration closed"
          }}
        </v-btn>
      </template>
    </v-banner>
    <v-container fluid>
      <v-layout row wrap v-if="event">
        <v-flex xs12 md5>
          <v-img
            :src="$hostname + '/images/' + event.image"
            max-height="400"
            max-width="95%"
            contain
            alt="loading..."
            class="mx-auto"
            style="cursor: pointer"
          ></v-img>
        </v-flex>
        <v-flex xs12 md7>
          <v-card elevation="0">
            <div class="text--black overline ml-5" v-if="event.tags">
              <v-row>
                <div v-for="(tag, i) in event.tags" :key="i" class="mx-1">
                  #{{ tag }}
                </div>
              </v-row>
            </div>
            <v-card-title style="color:#311B92">
              {{ event.name }}
            </v-card-title>

            <v-card-text>
              <div>
                <v-icon class="mr-2" small color="green">
                  mdi-clock-outline
                </v-icon>
                <span class="caption grey--text font-weight-light">
                  {{ event.start.split(",")[0] }},
                  {{ tConvert(event.start.split(",")[1]) }}
                </span>
              </div>
              <div>
                <v-icon class="mr-2" small color="green">
                  mdi-restore
                </v-icon>
                <span class="caption grey--text font-weight-light"
                  >Mode: {{ event.mode ? "Online" : "Offline" }}
                </span>
              </div>
              <div v-if="user">
                <v-icon
                  class="mr-2"
                  small
                  :color="
                    event.participants.find((item) => item.user == user._id)
                      ? 'green'
                      : 'red'
                  "
                >
                  {{
                    event.participants.find((item) => item.user == user._id)
                      ? "mdi-checkbox-marked-circle-outline"
                      : "mdi-close-circle-outline"
                  }}
                </v-icon>
                <span class="caption grey--text font-weight-light">
                  {{
                    event.participants.find((item) => item.user == user._id)
                      ? "Enrolled"
                      : "Un enrolled"
                  }}
                </span>
              </div>
              <div>
                <v-icon
                  class="mr-2"
                  small
                  :color="`${event.registration ? 'green' : 'red'}`"
                >
                  mdi-account-multiple-plus
                </v-icon>
                <span class="caption grey--text font-weight-light"
                  >Registration: {{ event.registration ? "Open" : "Closed" }}
                </span>
              </div>
              <div class="text--black overline my-3">Event Description</div>
              <div v-html="event.desc"></div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    event: null,
    user: null,
  }),
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
              this.getEvent(this.$router.currentRoute.params.pk);
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
              this.getEvent(this.$router.currentRoute.params.pk);
            } else {
              this.$vToastify.error(res.data.message);
            }
          });
      } else {
        this.$router.push("/login");
      }
    },
    getEvent(id) {
      axios
        .get(this.$hostname + "/post/getbypostid", {
          params: {
            postId: id,
            userId: this.user._id,
          },
        })
        .then((res) => {
          if (res.data.status) {
            this.event = res.data.event;
          } else {
            this.$vToastify.error(res.data.message);
          }
        });
    },
  },
  mounted() {
    if (
      this.$router.currentRoute.name === "EventDetail" &&
      this.$router.currentRoute.params.pk
    ) {
      this.getEvent(this.$router.currentRoute.params.pk);
    }
  },
  created() {
    if (sessionStorage.getItem("user") && sessionStorage.getItem("jwt")) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + sessionStorage.getItem("jwt");
      this.user = JSON.parse(sessionStorage.getItem("user"));
    }
  },
};
</script>

<style></style>
