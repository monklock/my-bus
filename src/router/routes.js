const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/HomePage.vue'),
      },
      {
        path: 'buses',
        component: () => import('pages/SettingPage.vue'),
      },
      {
        path: 'buses',
        component: () => import('pages/BusListPage.vue'),
      },
      {
        path: 'buses',
        component: () => import('pages/TaxiListPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
