import Vue from 'vue'
import App from './App.vue'
import Home from "./Home.vue"
import User from "./User.vue"
import SingleAuction from "./SingleAuction.vue"
import Auctions from "./Auctions.vue"

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);


const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/auctions",
    name: "auctions",
    component: Auctions
  },
  {
    path: "/auctions/:auctionId",
    name: "auction",
    component: SingleAuction
  },
  {
    path:"/user",
    name: "user",
    component: User
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
