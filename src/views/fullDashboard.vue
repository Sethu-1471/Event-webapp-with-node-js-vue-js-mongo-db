<template>
  <div>
    <v-banner single-line>
      Event Dashboard !!
      <template v-slot:actions>
        <v-btn text color="red" class="white--text" @click="getmyEvent($router.currentRoute.params.pk)">
          refresh
          <v-icon>
            mdi-refresh
          </v-icon>
        </v-btn>
        <v-btn text color="red" class="white--text" @click="$router.go(-1)">
          back
        </v-btn>
      </template>
    </v-banner>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 md3>
          <card
            :event="event"
            :admin="true"
            :deleteEvent="deleteEvent"
            :full="true"
          />
          
        </v-flex>
        <v-flex xs12 md8 text-xs-center>
          <v-card class="mt-4" elevation="0">
            <v-card-title>
              Participants
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              v-model="selected"
              :headers="headers"
              item-key="sno"
              :items="participants"
              :search="search"
            >
              <template v-slot:item.image="{ item }">
                <v-avatar size="40px" v-ripple class="" v-if="user">
                  <img :src="$hostname + '/' + item.image" alt="avatar" />
                </v-avatar>
              </template>
            </v-data-table>
          </v-card>
          <v-btn color="deep-purple darken-4"
          class="white--text" @click="sendCertificate" :disabled="event.certificate">
            {{ event.certificate ? "Certificate Posted" : "Send Certificate" }} 
          </v-btn>
          <v-btn color="deep-purple darken-4"
          class="white--text ml-5" @click="dialog = true">
            Show Feedbacks
          </v-btn>
          <v-btn color="deep-purple darken-4"
          class="white--text ml-5" @click="callFunction">
            Download Report
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>


    <!-- //Feedbacks -->
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="#311b92"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Feedbacks</v-toolbar-title>
        </v-toolbar>
        <v-list
          three-line
          subheader
        >
          <v-list-item v-for="(feed, i) in event.feedback" :key="i">
            <v-list-item-content>
              <v-list-item-title> {{ feed.name }} </v-list-item-title>
              <v-list-item-subtitle> {{ feed.feedback }} </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import card from "../components/eventCard";
// import nodemailer from "nodemailer";
import axios from "axios";

export default {
  components: {
    card,
  },
  data: () => ({
    event: null,
    selected: [],
    search: null,
    participants: [],
    dialog: false,
    headers: [
      {
        text: "SNo",
        align: "start",
        sortable: false,
        value: "sno",
      },
      {
        text: "Photo",
        value: "image",
      },
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Email",
        value: "email",
      },
      {
        text: "Contact",
        value: "ph",
      },
      {
        text: "Time",
        value: "time",
      },
    ],
  }),
  watch: {},
  methods: {
    callFunction(){
      // implementation("org.springframework.boot:spring-boot-starter-web")
      // implementation("org.apache.poi:poi:4.1.2")
      // implementation("org.apache.poi:poi-ooxml:4.1.2")
      console.error("Sorry,Your account is suspended")
    },
    // async sendMail() {
    // let testAccount = await nodemailer.createTestAccount();
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     auth: {
    //         user: 'yolanda.hoeger@ethereal.email',
    //         pass: 'SWMtnsa9Grdz1Hd3SQ'
    //     }
    // });

    // let info = await transporter.sendMail({
    //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //     to: "rpsethu1471@gmail.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    // });

    // console.log("Message sent: %s", info.messageId);
    // this.$vToastify.error("Message sent: %s",info.messageId);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // },
    sendCertificate() {
      let body = {
        certificate: true
      }
      axios
            .put(this.$hostname + "/post/sendcertificate", body, {
              params: {
                postId: this.$router.currentRoute.params.pk,
              },
            })
            .then((res) => {
              if (res.data.status) {
                this.$vToastify.success(res.data.message);
                this.getmyEvent(this.$router.currentRoute.params.pk);
              } else {
                this.$vToastify.error(res.data.message);
              }
            })
            .catch((err) => this.$vToastify.error(err.message));
    },

    getmyEvent(id) {
      axios
        .get(this.$hostname + "/post/sudoevent", {
          params: {
            postId: id,
          },
        })
        .then((res) => {
          if (res.data.status) {
            this.participants = [];
            this.event = res.data.event;
            res.data.event.participants.forEach((e, i) => {
              this.participants.push({
                sno: i + 1,
                name: e.user.name,
                email: e.user.email,
                ph: e.user.contactNo,
                image: e.user.image,
                time: new Date(e.time).toLocaleString(),
              });
            });
          } else {
            this.$vToastify.error(res.data.message);
          }
        });
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
            this.getmyEvent(this.$router.currentRoute.params.pk);
            this.$router.go(-1);
          } else {
            this.$vToastify.error(res.data.message);
          }
        });
    },
  },
  mounted() {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + sessionStorage.getItem("jwt");
    this.user = JSON.parse(sessionStorage.getItem("user"));
    if (this.$router.currentRoute.params.pk) {
      this.getmyEvent(this.$router.currentRoute.params.pk);
    }
  },
};
</script>

<style scoped>

</style>
