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
            <v-btn
              color="deep-purple darken-4"
              class="white--text"
              @click="dialog = !dialog"
              v-if="
                event.participants.find((item) => item.user == user._id)
                  ? event.certificate
                    ? true
                    : false
                  : false
              "
            >
              download Certificate
            </v-btn>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="dialog" persistent max-width="390">
      <v-card>
        <v-card-title class="headline">
          Feedback
        </v-card-title>
        <v-card-text>
          <v-textarea
            color="deep-purple darken-4"
            v-model="feedback"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            small
            class="white--text"
            text
            @click="update(event._id)"
          >
            Download Certificate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- //certiy -->
    <div class="mm">
    <div class="massContainer" id="my-node">
      <div class="container pm-certificate-container">
        <div class="outer-border"></div>
        <div class="inner-border"></div>

        <div class="pm-certificate-border col-xs-12">
          <div class="row pm-certificate-header">
            <div class="pm-certificate-title cursive col-xs-12 text-center">
              <h2>Certificate of Completion</h2>
            </div>
          </div>

          <div class="row pm-certificate-body">
            <div class="pm-certificate-block">
              <div class="col-xs-12">
                <div class="row">
                  <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                  <div
                    class="pm-certificate-name underline margin-0 col-xs-8 text-center"
                  >
                    <span class="pm-name-text bold"
                      > {{user.name}} </span
                    >
                  </div>
                  <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                </div>
              </div>

              <div class="col-xs-12">
                <div class="row">
                  <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                  <div class="pm-earned col-xs-8 text-center">
                    <span class="pm-earned-text padding-0 block cursive"
                      >has earned a certificate for attending {{ event.name }} held via {{ event.mode }} on {{ event.start.split(",")[0] }}  </span
                    >
                    <span class="pm-credits-text block bold sans"
                      >Credits: Examly Portal</span
                    >
                  </div>
                  <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                  <div class="col-xs-12"></div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
     </div>
  </div>
</template>

<script>
import axios from "axios";
// import { jsPDF } from "jspdf";
export default {
  data: () => ({
    dialog: false,
    event: null,
    user: null,
    feedback: "Hurray..! Wounderful Event..! Thank You...!",
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

    update(id) {
      if (sessionStorage.getItem("user") && sessionStorage.getItem("jwt")) {
        let body = {
          name: this.user.name,
          feedback: this.feedback,
        };
        axios
          .put(this.$hostname + "/post/feedback", body, {
            params: {
              postId: id,
            },
          })
          .then((res) => {
            if (res.data.status) {
              this.$vToastify.success(res.data.message);
              this.getEvent(this.$router.currentRoute.params.pk);
              var domtoimage = require("dom-to-image");
              domtoimage
                .toBlob(document.getElementById("my-node"))
                .then((blob) => {
                  var FileSaver = require('file-saver');
                  FileSaver.saveAs(blob,`${this.user.name + `-` + this.event.name}.png`);
                });
                this.dialog = false;
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

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans|Pinyon+Script|Rochester");
.cursive {
  font-family: "Pinyon Script", cursive;
}
.mm {
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
}
.sans {
  font-family: "Open Sans", sans-serif;
}
.bold {
  font-weight: bold;
}
.block {
  display: block;
}
.underline {
  border-bottom: 1px solid #777;
  padding: 5px;
  margin-bottom: 15px;
}
.margin-0 {
  margin: 0;
}
.padding-0 {
  padding: 0;
}
.pm-empty-space {
  height: 40px;
  width: 100%;
}

.pm-certificate-container {
  position: relative;
  width: 800px;
  height: 600px;
  background-color: #618597;
  padding: 10px;
  overflow: hidden;
  color: #333;
  font-family: "Open Sans", sans-serif;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  /* background: -webkit-repeating-linear-gradient(
    45deg,
    #618597,
    #618597 1px,
    #b2cad6 1px,
    #b2cad6 2px
  );
  background: repeating-linear-gradient(
    90deg,
    #618597,
    #618597 1px,
    #b2cad6 1px,
    #b2cad6 2px
  ); */
}

.pm-certificate-container .outer-border {
  width: 794px;
  height: 594px;
  position: absolute;
  left: 50%;
  margin-left: -397px;
  top: 50%;
  margin-top: -297px;
  border: 2px solid #fff;
}
.pm-certificate-container .inner-border {
  width: 730px;
  height: 530px;
  position: absolute;
  left: 50%;
  margin-left: -365px;
  top: 50%;
  margin-top: -265px;
  border: 2px solid #fff;
}
.pm-certificate-container .pm-certificate-border {
  position: relative;
  width: 720px;
  height: 520px;
  padding: 0;
  border: 1px solid #e1e5f0;
  background-color: #ffffff;
  background-image: none;
  left: 50%;
  margin-left: -360px;
  top: 50%;
  margin-top: -260px;
}
.pm-certificate-container .pm-certificate-border .pm-certificate-block {
  width: 650px;
  height: 200px;
  position: relative;
  left: 50%;
  margin-left: -325px;
  top: 70px;
  margin-top: 0;
}
.pm-certificate-container .pm-certificate-border .pm-certificate-header {
  margin-bottom: 10px;
}
.pm-certificate-container .pm-certificate-border .pm-certificate-title {
  position: relative;
  top: 40px;
}
.pm-certificate-container .pm-certificate-border .pm-certificate-title h2 {
  font-size: 34px !important;
}
.pm-certificate-container .pm-certificate-border .pm-certificate-body {
  padding: 20px;
}
.pm-certificate-container
  .pm-certificate-border
  .pm-certificate-body
  .pm-name-text {
  font-size: 20px;
}
.pm-certificate-container .pm-certificate-border .pm-earned {
  margin: 15px 0 20px;
}
.pm-certificate-container .pm-certificate-border .pm-earned .pm-earned-text {
  font-size: 20px;
}
.pm-certificate-container .pm-certificate-border .pm-earned .pm-credits-text {
  font-size: 15px;
}
.pm-certificate-container
  .pm-certificate-border
  .pm-course-title
  .pm-earned-text {
  font-size: 20px;
}
.pm-certificate-container
  .pm-certificate-border
  .pm-course-title
  .pm-credits-text {
  font-size: 15px;
}
.pm-certificate-container .pm-certificate-border .pm-certified {
  font-size: 12px;
}
.pm-certificate-container .pm-certificate-border .pm-certified .underline {
  margin-bottom: 5px;
}
.pm-certificate-container .pm-certificate-border .pm-certificate-footer {
  width: 650px;
  height: 100px;
  position: relative;
  left: 50%;
  margin-left: -325px;
  bottom: -105px;
}
</style>
