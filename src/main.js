import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';
import store  from "./store/store";
import VueToastify from "vue-toastify";
import VueRx from "vue-rx";
// Use build files
import VuejsClipper from "vuejs-clipper/dist/vuejs-clipper.umd";
import "vuejs-clipper/dist/vuejs-clipper.css";
import DatetimePicker from 'vuetify-datetime-picker'
// import 'vuetify-datetime-picker/src/stylus/main.styl'
import CKEditor from '@ckeditor/ckeditor5-vue2';

Vue.use( CKEditor );
Vue.use(DatetimePicker);
Vue.use(VueRx);
Vue.use(VuejsClipper);
Vue.use(VueToastify);
Vue.config.productionTip = false;
Vue.prototype.$hostname = (Vue.config.productionTip) ? 'https://hostname' : 'http://localhost:3400';

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
