<template>
  <div>
    <template>
      <v-container fluid v-if="events">
        <v-data-iterator
          :items="events"
          :search="search"
          hide-default-footer
        >
          <template v-slot:header>
            <v-banner single-line>
              Create and Host your event with us !!
              <template v-slot:actions>
                <v-text-field
                  v-model="search"
                  clearable
                  flat
                  single-line
                  solo-inverted
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  label="Search"
                ></v-text-field>
                <!-- <v-btn
                  color="deep-purple darken-4"
                  dark
                  @click="sheet = !sheet"
                >
                  Filter
                </v-btn> -->
                <v-btn
                  text
                  color="deep-purple darken-4"
                  @click="$router.push('/create')"
                >
                  Create Event
                </v-btn>
              </template>
            </v-banner>
           
          </template>

          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="item in props.items"
                :key="item.name"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <card
                  :event="item"
                  :attend="attend"
                  :user="user ? user : null"
                  :unAttend="unAttend"
                />
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-container>
    </template>

    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="200px">
        <v-btn class="mt-6" text color="red" @click="sheet = !sheet">
          close
        </v-btn>
        <div class="py-3">
          This is a bottom sheet using the controlled by v-model instead of
          activator
        </div>
      </v-sheet>
    </v-bottom-sheet>
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
    sheet: false,
    events: null,
    user: null,
    itemsPerPageArray: [4, 8, 12],
    search: "",
    filter: {},
    sortDesc: false,
    page: 1,
    itemsPerPage: 4,
    sortBy: "name",
    keys: [
      "Name",
      "Calories",
      "Fat",
      "Carbs",
      "Protein",
      "Sodium",
      "Calcium",
      "Iron",
    ],
    items: [
      {
        name: "Frozen Yogurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: "14%",
        iron: "1%",
      },
    ],
  }),
  mounted() {},
  created() {
    this.getPost();
    if (sessionStorage.getItem("user") && sessionStorage.getItem("jwt")) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + sessionStorage.getItem("jwt");
      this.user = JSON.parse(sessionStorage.getItem("user"));
    }
  },
  // computed: {
  //   numberOfPages() {
  //     return Math.ceil(this.items.length / this.itemsPerPage);
  //   },
  //   filteredKeys() {
  //     return this.keys.filter((key) => key !== "Name");
  //   },
  // },
  methods: {
    getPost() {
      axios.get(this.$hostname + "/post/getbypublic").then((res) => {
        if (res.data.status) {
          this.events = res.data.events;
        } else {
          this.$vToastify.error(res.data.message);
        }
      });
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
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
              this.getPost();
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
              this.getPost();
            } else {
              this.$vToastify.error(res.data.message);
            }
          });
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style></style>
