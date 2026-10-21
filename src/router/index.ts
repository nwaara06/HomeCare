import { createRouter, createWebHistory } from '@ionic/vue-router'

import DashboardPage from '../views/DashboardPage.vue'
import InventoryPage from '../views/InventoryPage.vue'
import ItemFormPage from '../views/ItemFormPage.vue'
import ItemDetailPage from '@/views/ItemDetailPage.vue'
import MaintenancePage from '@/views/MaintenancePage.vue'
import MaintenanceFormPage from '@/views/MaintenanceFormPage.vue'
import MaintenanceDetailPage from '@/views/MaintenanceDetailPage.vue'
import MaintenanceHistoryPage from '../views/MaintenanceHistoryPage.vue'
import WelcomePage from '../views/WelcomePage.vue'

const routes = [

  {
    path: '/',
    redirect: '/welcome',
  },

  {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomePage,
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
  },

  {
    path: '/inventory',
    name: 'Inventory',
    component: InventoryPage,
  },

  {
    path: '/inventory/add',
    name: 'ItemForm',
    component: ItemFormPage,
  },

  {
  path: '/inventory/edit/:id',
  component: ItemFormPage
},

  {
  path: '/inventory/:id',
  component: ItemDetailPage
},

{
  path: '/maintenance',
  component: MaintenancePage
},

{
  path: '/maintenance/add',
  component: MaintenanceFormPage
},

{
  path: '/maintenance/history',
  component: MaintenanceHistoryPage
},

{
  path: '/history',
  component: MaintenanceHistoryPage
},

{
  path: '/maintenance/:id',
  component: MaintenanceDetailPage
}

]

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),

  routes,

})

export default router