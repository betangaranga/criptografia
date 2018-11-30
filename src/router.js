import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Principal from './components/Principal.vue'
import Formato from './components/Formato.vue'
import Bandeja from './components/Bandeja.vue'
import Datos from './components/Datos.vue'

Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/principal',
      name: 'principal',
      component: Principal,
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
