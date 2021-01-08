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
              show-select
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
        </v-flex>
      </v-layout>
    </v-container>
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

<style></style>
