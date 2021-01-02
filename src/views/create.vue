<template>
  <div>
    <v-banner single-line>
      Create and Host your event with us !!
      <template v-slot:actions>
        <v-btn color="red" class="white--text" @click="$router.go(-1)">
          Cancel
        </v-btn>
        <v-btn
          color="deep-purple darken-4"
          class="white--text"
          @click="actionType == 'Host' ? hostEvent() : updateEvent()"
        >
          {{ actionType }} Event
        </v-btn>
      </template>
    </v-banner>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 md5>
          <!-- <clipper-upload v-model="src[1]">upload image</clipper-upload>
                <clipper-basic :src="src[1]" gird ref="clipper" preview="preview">
                    <div slot="placeholder">No image</div>
                </clipper-basic> -->
          <!-- <clipper-preview  name="preview"></clipper-preview> -->
          <image-input v-model="avatar">
            <div slot="activator">
              <v-sheet
                v-if="!avatar"
                class="grey lighten-4 mx-auto"
                v-ripple
                height="200"
                width="400"
                style="cursor: pointer"
              >
                <v-layout justify-center fill-height>
                  <v-icon color="deep-purple darken-4" large>mdi-plus</v-icon>
                </v-layout>
              </v-sheet>
              <p
                v-if="!avatar"
                class="overline grey--text layout justify-center"
              >
                Event Poster
              </p>
              <!-- <v-avatar size="120px" v-ripple v-else class="">
                <img :src="avatar.imageURL" alt="avatar" />
              </v-avatar> -->
              <v-img
                v-else
                :src="avatar.imageURL ? avatar.imageURL : avatar"
                max-height="400"
                max-width="95%"
                contain
                alt="loading..."
                class="mx-auto"
                style="cursor: pointer"
              ></v-img>
              <p v-if="avatar" class="overline grey--text layout justify-center">
                click over the image to change
              </p>
            </div>
          </image-input>
        </v-flex>
        <v-flex xs12 md7 pl-3 pr-5 justify-center>
          <v-text-field
            color="deep-purple darken-4"
            label="Event Name"
            v-model="name"
          ></v-text-field>
          <p class="overline grey--text">
            Description
          </p>
          <ckeditor
            label="Description"
            :editor="editor"
            v-model="desc"
            :config="editorConfig"
          ></ckeditor>
          <v-combobox
            multiple
            v-model="tags"
            label="Tags (optional)"
            append-icon
            chips
            deletable-chips
            required
            color="deep-purple darken-4"
          >
          </v-combobox>
          <v-row>
            <v-menu
              v-model="startDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  color="deep-purple darken-4"
                  label="Event start date"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  v-model="startDate"
                  class="pl-3"
                  clearable
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                color="deep-purple darken-4"
                header-color="deep-purple darken-4"
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="deep-purple darken-4"
                  @click="startDateMenu = false"
                >
                  ok
                </v-btn>
              </v-date-picker>
            </v-menu>

            <v-menu
              v-model="startTimeMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  color="deep-purple darken-4"
                  label="Event start Time"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  v-model="startTimeShow"
                  class="pl-3"
                  clearable
                  width="200"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="startTime"
                color="deep-purple darken-4"
                header-color="deep-purple darken-4"
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="deep-purple darken-4"
                  @click="startTimeMenu = false"
                >
                  ok
                </v-btn>
              </v-time-picker>
            </v-menu>
          </v-row>

          <v-row align="center" class="pl-3">
            <div class="pr-5">
              <p class="overline grey--text">
                Event Mode
              </p>
              <v-radio-group v-model="type">
                <v-radio
                  v-for="(n, i) in types"
                  :key="i"
                  :label="`${n.name}`"
                  :value="n.bool"
                  color="deep-purple darken-4"
                ></v-radio>
              </v-radio-group>
            </div>

            <div>
              <p class="overline grey--text">
                Privacy
              </p>
              <v-radio-group v-model="privacy">
                <v-radio
                  v-for="(n, i) in privacys"
                  :key="i"
                  :label="`${n.name}`"
                  :value="n.bool"
                  color="deep-purple darken-4"
                ></v-radio>
              </v-radio-group>
            </div>
          </v-row>
          <v-text-field
            color="deep-purple darken-4"
            :label="
              `${
                type ? 'Event link' : 'Location link (google map) '
              } (optional)`
            "
            v-if="type !== null"
            v-model="modelink"
            clearable
          ></v-text-field>
          <v-checkbox
            color="deep-purple darken-4"
            v-model="registration"
            :label="`Open for Registration: ${registration.toString()}`"
          ></v-checkbox>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import imageInput from "./imageInput";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";

export default {
  components: {
    imageInput,
  },
  data: () => ({
    dialog: false,
    user: null,
    registration: true,
    modelink: null,
    types: [
      {
        name: "Online",
        bool: true,
      },
      {
        name: "Offline",
        bool: false,
      },
    ], //online means true
    type: null,
    privacy: true,
    privacys: [
      {
        name: "Only me",
        bool: false,
      },
      {
        name: "Public",
        bool: true,
      },
    ],
    actionType: null,
    startDateMenu: false,
    endDateMenu: false,
    startTimeMenu: false,
    endTimeMenu: false,
    editor: ClassicEditor,
    avatar: null,
    name: null,
    desc: null,
    tags: null,
    file: null,
    startDate: null,
    endDate: null,
    startTime: null,
    startTimeShow: null,
    endTime: null,
    orginalImage: null,
    editorConfig: {
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "|",
        "NumberedList",
        "BulletedList",
        "|",
        "undo",
        "redo",
      ],
    },
  }),
  updated() {},
  watch: {
    avatar: {
      handler: function() {
        this.file = this.avatar.imageData;
      },
      deep: true,
    },
    endTime: {
      handler: function() {
        this.endTime = this.tConvert(this.endTime);
      },
    },
    startTime: {
      handler: function() {
        this.startTimeShow = this.tConvert(this.startTime);
      },
    },
  },
  methods: {
    //update event
    updateEvent() {
      if (
        !this.name ||
        !this.avatar ||
        !this.startDate ||
        !this.startTime ||
        !this.type.toString() ||
        !this.desc
      ) {
        this.$vToastify.error("some fields are unfilled");
      } else {
        if (this.orginalImage === this.avatar) {
          // same image
          let body = {
            name: this.name,
            start: this.startDate + "," + this.startTime,
            mode: this.type,
            public: this.privacy,
            registration: this.registration,
            desc: this.desc,
            tags: this.tags ? this.tags[0].split(",") : null,
            end: this.end,
            modelink: this.modelink
          };
          axios
            .put(this.$hostname + "/post/update", body, {
              params: {
                postId: this.$router.currentRoute.params.pk,
                userId: this.user._id,
              },
            })
            .then((res) => {
              if (res.data.status) {
                this.$vToastify.success(res.data.message);
                this.$router.push("/dashboard");
              } else {
                this.$vToastify.error(res.data.message);
              }
            })
            .catch((err) => console.log(err));
        } else {
          //image change
          axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
          let formData = new FormData();
          formData.append("file", this.file);
          formData.append("name", this.name);
          formData.append("start", this.startDate + "," + this.startTime);
          formData.append("mode", this.type);
          formData.append("public", this.privacy);
          formData.append("registration", this.registration);
          formData.append("desc", this.desc);
          formData.append("tags", this.tags);
          formData.append("end", this.endDate);
          formData.append("modelink", this.modelink)
          let ev = this.orginalImage.split("/");
          axios
            .put(this.$hostname + "/post/update", formData, {
              params: {
                postId: this.$router.currentRoute.params.pk,
                userId: this.user._id,
                withImage: true,
                orginalImage: ev[ev.length - 1],
              },
            })
            .then((res) => {
              if (res.data.status) {
                this.$vToastify.success(res.data.message);
                this.$router.push("/dashboard");
              } else {
                this.$vToastify.error(res.data.message);
              }
            })
            .catch((err) => console.log(err));
        }
      }
    },
    //save event
    hostEvent() {
      if (
        !this.name ||
        !this.file ||
        !this.startDate ||
        !this.startTime ||
        !this.type.toString() ||
        !this.desc
      ) {
        this.$vToastify.error("some fields are unfilled");
      } else {
        axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
        let formData = new FormData();
        formData.append("file", this.file);
        formData.append("name", this.name);
        formData.append("start", this.startDate + "," + this.startTime);
        formData.append("mode", this.type);
        formData.append("public", this.privacy);
        formData.append("registration", this.registration);
        formData.append("desc", this.desc);
        formData.append("tags", this.tags);
        formData.append("end", this.endDate);
        formData.append("admin", this.user._id);
        formData.append("modelink", this.modelink)
        axios
          .post(this.$hostname + "/post/save", formData)
          .then((res) => {
            if (res.data.status) {
              this.$vToastify.success(res.data.message);
              this.$router.push("/dashboard");
            } else {
              this.$vToastify.error(res.data.message);
            }
          })
          .catch((err) => console.error(err));
      }
    },
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
    getEvent(id) {
      axios
        .get(this.$hostname + "/post/getbypostid", {
          params: {
            postId: id,
            userId: JSON.parse(localStorage.getItem("user"))
              ? JSON.parse(localStorage.getItem("user"))._id
              : null,
          },
        })
        .then((res) => {
          if (res.data.status) {
            const event = res.data.event;
            this.name = event.name;
            this.desc = event.desc;
            this.avatar = this.$hostname + "/images/" + event.image;
            this.orginalImage = this.$hostname + "/images/" + event.image;
            this.tags = event.tags == "null" ? null : event.tags;
            this.startDate = event.start.split(",")[0];
            this.startTime = event.start.split(",")[1];
            this.type = event.mode;
            this.privacy = event.public;
            this.registration = event.registration;
            this.modelink = event.modelink;
          } else {
            this.$vToastify.error(res.data.message);
          }
        });
    },
  },
  created() {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("jwt");
    this.user = JSON.parse(localStorage.getItem("user"));
  },
  mounted() {
    if (
      this.$router.currentRoute.name === "Edit" &&
      this.$router.currentRoute.params.pk
    ) {
      this.getEvent(this.$router.currentRoute.params.pk);
      this.actionType = "Update";
    } else {
      this.actionType = "Host";
    }
    //         this.$refs.clipper.onChange$.subscribe(() => {
    //   // This happens whenever zooming, moving, and rotating occur.
    //   const canvas = this.$refs.clipper.clip();
    //   if (canvas.getContext) {
    //      var ctx = canvas.getContext("2d");
    //      var myImage = canvas.toDataURL("image/png");
    //      console.log(ctx, myImage);
    //   }
    // })
  },
};
</script>

<style></style>
