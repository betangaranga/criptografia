import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Principal from './components/Principal.vue'
import Formato from './components/Formato.vue'
import Bandeja from './components/Bandeja.vue'
import Datos from './components/Datos.vue'
import firebase from 'firebase'

Vue.use(Router)

let router=new Router({
  mode:"history",
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/principal',
      name: 'principal',
      component: Principal,
      meta: {
        requiresAuth: true
      },
      children:[
        {
          path:'formato',
          name:'formato',
          component:Formato
        },
        {
          path:'bandeja',
          name:'bandeja',
          component:Bandeja
        },
        {
          path:'datos',
          name:'datos',
          component:Datos
        }
      ]
    }
  ]
})
/*router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('principal')
  else next()
})*/
export default router
