<template>
  <v-app id="body">
    <v-app-bar app color="white">
      <div class="d-flex align-center header" @click="$router.push('/')">
        Evenly
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="$router.push('/')" text color="#757575">
        <span class="mr-2">Home</span>
      </v-btn>
      <v-btn
        @click="$router.push('/dashboard')"
        text
        color="#757575"
        v-if="isAuth"
      >
        <span class="mr-2">Dashboard</span>
      </v-btn>
      <v-btn
        @click="$router.push('/admin')"
        text
        color="#757575"
        v-if="isAdmin"
      >
        <span class="mr-2">Admin</span>
      </v-btn>
      <v-btn
        @click="$router.push('/profile')"
        text
        color="#757575"
        v-if="isAuth"
      >
        <span class="mr-2">Profile</span>
      </v-btn>
      <v-btn
        @click="$router.push('/register')"
        text
        color="#757575"
        v-if="!isAuth"
      >
        <span class="mr-2">Register</span>
      </v-btn>
      <v-btn
        @click="$router.push('/login')"
        text
        color="#757575"
        v-if="!isAuth"
      >
        <span class="mr-2">Login</span>
      </v-btn>
      <v-btn @click="logout" text color="#757575" v-if="isAuth">
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <v-footer color="deep-purple darken-4" padless>
      <v-row justify="center" no-gutters>
        <v-btn v-for="icon in icons" :key="icon" class="mx-4 white--text" icon>
          <v-icon size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
        <v-col
          class="deep-purple darken-4 py-4 text-center white--text"
          cols="12"
        >
          {{ new Date().toDateString() }} — <strong>Evenly</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  name: "App",
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
  }),
  mounted() {
    this.notifyMe();
  },
  computed: {
    isAuth() {
      return this.$store.state.isAuthenticated;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
  },
  methods: {
    notifyMe() {
      // Let's check if the browser supports notifications
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      }

      // Let's check whether notification permissions have alredy been granted
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        if (!sessionStorage.getItem("notify")) this.triggerPushNotification();
      }
      // Otherwise, we need to ask the user for permission
      else if (
        Notification.permission !== "denied" ||
        Notification.permission === "default"
      ) {
        Notification.requestPermission((permission) => {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            if (!sessionStorage.getItem("user")) this.triggerPushNotification();
          }
        });
      }

      // At last, if the user has denied notifications, and you
      // want to be respectful there is no need to bother them any more.
    },

    urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },

    async triggerPushNotification() {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            axios
              .get(this.$hostname + "/key")
              .then((res) => {
                reg.pushManager
                  .subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(res.data),
                  })
                  .then((sub) => {
                    sessionStorage.setItem("notify", sub);
                    axios
                      .post(
                        this.$hostname + "/notify/subscribe",
                        JSON.stringify(sub),
                        {
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      )
                      .then((res) => console.log(res.status));
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));

        // await fetch('/subscribe', {
        //   method: 'POST',
        //   body: JSON.stringify(subscription),
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
      } else {
        console.error("Service workers are not supported in this browser");
      }
    },

    async logout() {
      await sessionStorage.clear();
      this.$store.state.isAuthenticated = false;
      this.$store.state.isAdmin = false;
      this.$router.push("/login");
      this.$vToastify.success("Logged Out");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@200&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Hanalei+Fill&display=swap");

.body {
  font-family: "Nunito", sans-serif;
}

.header {
  font-family: "Hanalei Fill", cursive;
  font-size: 35px;
  letter-spacing: 1px;
  color: #311b92;
}

.greyColor {
  color: #757575;
}
</style>
