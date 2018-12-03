import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import VueA11yDialog from 'vue-a11y-dialog'
Vue.use(VueA11yDialog)
Vue.use(VueMaterial)
Vue.use(VueFire)
var config = {
  apiKey: "AIzaSyCm6ldTlUzZErMnI9xpBoRYj7rnOBmTb1A",
  authDomain: "proj-crypto.firebaseapp.com",
  databaseURL: "https://proj-crypto.firebaseio.com",
  projectId: "proj-crypto",
  storageBucket: "proj-crypto.appspot.com",
  messagingSenderId: "799372258147"
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);
export const db = firebase.firestore()
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
