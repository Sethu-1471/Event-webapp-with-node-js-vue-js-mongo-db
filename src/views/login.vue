<template>
<div>
    <v-container fill-height fluid>
        <v-row align="center" justify="center">
            <v-col>
                <v-card max-width="400px" class="mx-auto pa-5">
                    <v-text-field v-model="email" label="Email" color="deep-purple darken-4"></v-text-field>
                    <v-text-field v-model="password" label="Password" color="deep-purple darken-4" :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'" @click:append="() => (value = !value)" :type="value ? 'password' : 'text'" @keyup.enter="doLogin"></v-text-field>
                    <v-btn class="deep-purple darken-4 white--text" @click="doLogin">
                        Login
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</div>
</template>

<script>
const axios = require('axios');
export default {
    name: 'Login',
    components: {
  
    },
    data: () => ({
        email: null, //username
        password: null,
        value: true,
    }),
    methods: {
        doLogin() {
            let body = {
                username: this.email,
                password: this.password
            }
            axios.post(this.$hostname + "/auth/login", JSON.stringify(body), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.data.status) {
                    localStorage.setItem('jwt', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    if (response.data.user.isAdmin){
                        localStorage.setItem('isAdmin', response.data.user.isAdmin);
                        this.$store.state.isAdmin = true;
                    } else {
                        localStorage.removeItem('isAdmin');
                    }
                    this.email = null;
                     this.password = null;
                    this.$vToastify.success(response.data.message);
                    this.$store.state.isAuthenticated = true;
                    this.$router.push('/dashboard');
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
