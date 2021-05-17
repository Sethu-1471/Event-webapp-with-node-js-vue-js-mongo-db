<template>
<div>
    <v-container fill-height fluid>
        <v-row align="center" justify="center">
            <v-col>
                <v-card max-width="400px" class="mx-auto pa-5">
                    <div class="layout align-center justify-center fill-height">
                        <image-input v-model="avatar">
                        <div slot="activator">
                            <v-avatar size="120px" v-ripple v-if="!avatar" class="grey lighten-3">
                                <v-icon>mdi-plus</v-icon>
                            </v-avatar>
                            <v-avatar size="120px" v-ripple v-else class="">
                                <img :src="avatar.imageURL" alt="avatar">
                            </v-avatar>
                        </div>
                    </image-input>
                    </div>
                    <v-text-field v-model="name" label="Name" color="deep-purple darken-4"></v-text-field>
                    <v-text-field v-model="phoneNo" label="Phone no" color="deep-purple darken-4"></v-text-field>
                    <v-text-field v-model="email" label="Email" color="deep-purple darken-4"></v-text-field>
                    <v-text-field v-model="password" label="Password" color="deep-purple darken-4" :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'" @click:append="() => (value = !value)" :type="value ? 'password' : 'text'"></v-text-field>
                    <v-text-field v-model="otp" label="OTP"  color="deep-purple darken-4"></v-text-field>
                    <v-btn class="deep-purple darken-4 white--text" @click="doRegister">
                        Sign Up
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</div>
</template>

<script>
const axios = require('axios');
import imageInput from './imageInput'
export default {
    name: 'Register',
    components: {
        imageInput
    },
    data: () => ({
        avatar: null,
        file: null,
        name: null,
        password: null,
        email: null,
        phoneNo: null,
        value: true
    }),
    watch: {
        avatar: {
            handler: function () {
                this.file = this.avatar.imageData
            },
            deep: true
        }
    },
    mounted() {

    },
    methods: {
        doRegister() {
            const form = new FormData();
            form.append('file', this.file);
            form.append('contactNo', this.phoneNo);
            form.append('name', this.name);
            form.append('email', this.email);
            form.append('password', this.password);
            axios.post(this.$hostname + "/auth/register", form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                if (response.data.status) {
                    this.$vToastify.success(response.data.message);
                    this.$router.push('/login');
                } else {
                    this.$vToastify.error(response.data.message);
                }
            })
        }
    }
}
</script>

<style>

</style>
