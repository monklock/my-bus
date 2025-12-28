const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/HomePage.vue')
      },
      {
        path: 'buses',
        name: 'buses',
        component: () => import('pages/BusListPage.vue')
      },
      {
        path: 'taxi',
        name: 'taxi',
        component: () => import('pages/TaxiListPage.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/SettingPage.vue')
      }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
