export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/stations',
    name: 'Stations',
    icon: 'smile',
    component: './Stations',
  },
  {
    path: '/success',
    name: 'Success',
    icon: 'smile',
    hideInMenu: true,
    component: './success',
  },
  {
    path: '/notifications',
    name: 'dashboard.notifications',
    icon: 'bell',
    component: './Notifications',
  },
  {
    path: '/warning-messages',
    name: 'dashboard.warning',
    icon: 'bell',
    component: './Warnings',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
