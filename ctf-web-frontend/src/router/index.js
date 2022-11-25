import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: 'my-events'
  },
  {
    path: '/my-events',
    name: 'my-events',
    component: () => import(/* webpackChunkName: "my-events" */ '@/views/MyEvents.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Register.vue')
  },
  {
    path: '/forget-password',
    name: 'forget-password',
    component: () => import(/* webpackChunkName: "login" */ '@/views/ForgetPassword.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import(/* webpackChunkName: "account" */ '@/views/Account.vue')
  },
  {
    path: '/admin',
    name: 'admin-select-event',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/AdminSelectEvent')
  },
  {
    path: '/admin/create',
    name: 'admin-create-event',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/AdminCreateEvent')
  },
  {
    path: '/admin/:gameId',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin.vue'),
    children: [
      {
        path: '',
        redirect: 'general-configuration'
      },
      {
        path: 'general-configuration',
        name: 'admin-general-configuration',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/GeneralConfiguration.vue')
      },
      {
        path: 'missions',
        name: 'admin-missions',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/Missions.vue')
      },
      {
        path: 'missions/create',
        name: 'admin-missions-create',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/CreateMission.vue')
      },
      {
        path: 'missions/:missionId',
        name: 'admin-missions-edit',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/EditMission.vue')
      },
      {
        path: 'item-shop',
        name: 'admin-item-shop',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/ItemShop.vue')
      },
      {
        path: 'item-shop/create',
        name: 'admin-item-shop-create',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/AddItemShop.vue')
      },
      {
        path: 'item-shop/:itemId',
        name: 'admin-item-shop-edit',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/EditItemShop.vue')
      },
      {
        path: 'participants',
        name: 'admin-participants',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/Participants.vue')
      },
      {
        path: 'participants/create',
        name: 'admin-participants-create',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/AddParticipant.vue')
      },
      {
        path: 'participants/:participantId',
        name: 'admin-participants-edit',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/EditParticipant.vue')
      },
      {
        path: 'game-events',
        name: 'admin-game-events',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/GameEvents.vue')
      },
      {
        path: 'leaderboard',
        name: 'admin-leaderboard',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/LiveScoreboard.vue')
      },
      {
        path: '*',
        redirect: 'general-configuration'
      }
    ]
  },
  {
    path: '/gameboard/:gameId',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/Gameboard.vue'),
    children: [
      {
        path: '',
        name: 'gameboard',
        component: () => import(/* webpackChunkName: "game" */ '@/views/Gameboard/Gameboard.vue'),
        meta: {
          navBarType: 'gameboard'
        }
      },
      {
        path: 'summary',
        name: 'game-summary',
        component: () => import(/* webpackChunkName: "game" */ '@/views/Gameboard/Summary.vue'),
        meta: {
          navBarType: 'gameboard'
        }
      },
      {
        path: 'profile',
        name: 'game-team-profile',
        component: () => import(/* webpackChunkName: "game" */ '@/views/Gameboard/GameProfile.vue'),
        meta: {
          navBarType: 'gameboard'
        }
      },
      {
        path: 'items',
        name: 'game-items',
        component: () => import(/* webpackChunkName: "game" */ '@/views/Gameboard/ItemShop.vue'),
        meta: {
          navBarType: 'gameboard'
        }
      },
      {
        path: 'items/:inventoryId',
        name: 'game-items-view-item',
        component: () => import(/* webpackChunkName: "game" */ '@/views/Gameboard/ItemShop.vue'),
        meta: {
          navBarType: 'gameboard'
        }
      },
      {
        path: 'chall/:challId',
        name: 'gameboard-chall',
        component: () => import(/* webpackChunkName: "game" */ '@/views/Gameboard/Gameboard.vue'),
        meta: {
          navBarType: 'gameboard'
        }
      }
    ]
  },
  {
    path: '/scoreboard/:eventId',
    name: 'scoreboard',
    component: () => import(/* webpackChunkName: "scoreboard" */ '@/views/Scoreboard.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
