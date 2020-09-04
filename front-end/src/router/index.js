import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store';

Vue.use(VueRouter)

// My approach to component management was to make the components in views folder
// single-use wrappers around the single- or multi-use components in the components
// folder. Essentially, the views are the web pages, and the components are the content
const routes = [
  {
    path: '/',
    name: 'Games',
    component: () => import(/* webpackChunkName: "games" */ '../views/Games.vue'),
    meta: {
      icon: 'mdi-home-circle-outline',
    }
  },
  {
    path: '/game/:id',
    name: 'GamePage',
    component: () => import(/* webpackChunkName: "game" */ '../views/Game.vue'),
    meta: {
      hidden: true,
      requiresAuth: true,
      updateUser: true
    }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import(/* webpackChunkName: "signin" */ '../views/SignIn.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import(/* webpackChunkName: "signin" */ '../views/SignIn.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/user',
    name: 'My Account',
    component: () => import(/* webpackChunkName: "user" */ '../views/User.vue'),
    meta: {
      icon: 'mdi-account-circle-outline',
      requiresAuth: true,
      updateUser: true
    },
    children: [
      {
        path: 'games',
        name: 'Inventory',
        component: () => import(/* webpackChunkName: "games" */ '../views/UserGames.vue'),
        meta: { 
          icon: 'mdi-view-carousel' 
        },
      },
      {
        path: 'trades',
        name: 'Trade Requests',
        component: () => import(/* webpackChunkName: "trades" */ '../views/UserTrades.vue'),
        meta: { 
          icon: 'mdi-swap-vertical-bold' 
        },
      }
    ],
  },
  {
    path: '/support',
    name: 'Support',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "support" */ '../views/Support.vue'),
    meta: {
      icon: 'mdi-help-circle-outline',
    }
  },
]

const router = new VueRouter({
  // set router to HTML5 history mode
  mode: 'history',
  routes
});

// Heavily inspired by https://router.vuejs.org/guide/advanced/meta.html
router.beforeEach(function(to, from, next) {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(!store.getters.signedIn) {
      next({
        path: '/signin',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
