<template>
  <div>
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
    <v-container fill-height fluid v-if="user">
      <v-row align="center" justify="center">
        <v-col>
          <v-card max-width="400px" class="mx-auto pa-5">
            <div class="layout align-center justify-center fill-height">
              <v-avatar size="120px" v-ripple class="" v-if="user">
                <img :src="image.imageURL" alt="avatar" />
              </v-avatar>
            </div>
            <v-text-field
              v-model="user.name"
              disabled
              label="Name"
              color="deep-purple accent-4"
            ></v-text-field>
            <v-text-field
              v-model="user.contactNo"
              disabled
              label="Phone no"
              color="deep-purple accent-4"
            ></v-text-field>
            <v-text-field
              v-model="user.email"
              disabled
              label="Email"
              color="deep-purple accent-4"
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              disabled
              label="Password"
              color="deep-purple accent-4"
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
            ></v-text-field>
            <!-- <v-btn class="deep-purple accent-4 white--text" @click="doRegister">
                        Update
                    </v-btn> -->
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "Register",
  components: {},
  data: () => ({
    image: null,
    value: true,
    user: null
  }),
  watch: {
    avatar: {
      handler: function() {
        this.file = this.avatar.imageData;
      },
      deep: true,
    },
  },
  created() {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + sessionStorage.getItem("jwt");
    this.user = JSON.parse(localStorage.getItem("user"));
    this.image = { imageURL: this.$hostname + "/" + JSON.parse(localStorage.getItem("user")).image };
    // this.name = user.name;
    // this.email = user.email;
    // this.phoneNo = user.contactNo;
    // this.id = user._id;
    // this.password = user.password;
  },
  mounted() {

  },
  methods: {
    
  },
};
</script>

<style></style>
