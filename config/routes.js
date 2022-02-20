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
    hideInMenu: true,
    component: './Welcome',
  },
  {
    path: '/main-page',
    name: 'Main',
    icon: 'smile',
    component: './Home',
  },
  {
    path: '/stations',
    name: 'Stations',
    icon: 'DeploymentUnitOutlined',
    component: './Stations',
  },
  {
    path: '/notifications',
    name: 'Notifications',
    icon: 'bell',
    component: './Notifications',
  },
  {
    path: '/fire-reports',
    name: 'fireReports',
    icon: 'bell',
    hideInMenu: true,
    component: './Cases/FireReport',
  },
  {
    path: '/warning-messages',
    name: 'warning',
    icon: 'bell',
    hideInMenu: true,
    component: './Cases/PriorWarnings',
  },
  {
    path: '/cases',
    name: 'cases',
    icon: 'FolderOutlined',
    component: './Cases/FireReport',
    routes: [
      {
        path: '/fire-reports',
        name: 'fireReports',
        icon: 'bell',
        component: './Cases/FireReport',
      },
      {
        path: '/warning-messages',
        name: 'warning',
        icon: 'bell',
        component: './Cases/PriorWarnings',
      },
    ],
  },
  {
    path: '/success',
    name: 'Success',
    icon: 'smile',
    hideInMenu: true,
    component: './success',
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
    hideInMenu: true,
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/main-page',
  },
  {
    component: './404',
  },
];
