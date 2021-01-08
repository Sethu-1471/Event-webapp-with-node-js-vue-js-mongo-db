<template>
  <div>
    <v-card
      class="mx-4 my-4"
      max-width="344"
      min-width="344"
      outlined
      v-if="event"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">
            <div>
              <span
                v-for="(tag, i) in event.tags[0].split(',')"
                :key="i"
                class="mx-1"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
          <v-list-item-title
            class="title mb-1"
            @click="$router.push('/event/' + event._id)"
            style="cursor:pointer"
          >
            {{ event.name }} 
          </v-list-item-title>
          <v-list-item-subtitle> </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar tile size="80">
          <v-img
            :src="$hostname + '/images/' + event.image"
            contain
            style="cursor:pointer"
            @click="$router.push('/event/' + event._id)"
          ></v-img
        ></v-list-item-avatar>
      </v-list-item>
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
        <div v-if="admin">
          <v-icon
            class="mr-2"
            small
            :color="`${event.public ? 'green' : 'red'}`"
          >
            mdi-earth
          </v-icon>
          <span class="caption grey--text font-weight-light"
            >Privacy: {{ event.public ? "Public" : "Only me" }}
          </span>
        </div>
        <div v-if="admin">
          <v-icon
            class="mr-2"
            small
            :color="`${event.public ? 'green' : 'red'}`"
          >
            mdi-account
          </v-icon>
          <span class="caption grey--text font-weight-light"
            >Total Registration: {{ event.participants.length }}
          </span>
        </div>
        <div v-if="admin">
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
      </v-card-text>

      <v-divider class="mx-4"></v-divider>
      <v-card-actions>
        <v-btn
          v-if="!admin"
          small
          :disabled="!event.registration"
          color="deep-purple darken-4"
          text
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
        <v-btn
          v-if="admin"
          color="deep-purple darken-4"
          class="white--text"
          small
          @click="$router.push('/edit/' + event._id)"
        >
          Edit
        </v-btn>
        <v-btn
          v-if="admin"
          color="red"
          small
          class="white--text"
          text
          @click="deleteEvent(event.createdBy._id, event._id, event.image)"
        >
          delete
        </v-btn>
        <v-btn
          v-if="admin && !full"
          color="red"
          small
          class="white--text"
          icon
          title="Go to Event Dashboard"
          @click="$router.push('/event-dashboard/' + event._id)"
        >
          <v-icon small>
            mdi-view-dashboard
          </v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <v-avatar size="34px">
          <img
            v-if="event"
            alt="Avatar"
            :src="$hostname + '/' + event.createdBy.image"
          />
        </v-avatar>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: [
    "event",
    "admin",
    "full",
    "deleteEvent",
    "attend",
    "unAttend",
    "user",
  ],
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
  },
};
</script>

<style></style>
