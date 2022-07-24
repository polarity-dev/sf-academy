import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import importDataView from '../views/importDataView.vue'
import pendingDataView from '../views/pendingDataView.vue'
import processedDataView from '../views/processedDataView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',

    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
{
    path: '/importDataFromFile',
    name: 'importDataFromFile',
    component: importDataView
  },
  {
    path: '/pendingDataView',
    name: 'pendingDataView',
    component: pendingDataView
  },
  {
    path: '/processedDataView',
    name: 'processedDataView',
    component: processedDataView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
