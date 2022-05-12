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
    name: 'main',
    icon: 'smile',
    component: './Home',
  },
  {
    path: '/stations',
    name: 'stations',
    icon: 'DeploymentUnitOutlined',
    component: './Stations',
  },
  {
    path: '/verification-request',
    name: 'Verification Requests',
    icon: 'DeploymentUnitOutlined',
    component: './Verification',
  },
  {
    path: '/notifications',
    name: 'Notifications',
    icon: 'bell',
    hideInMenu: true,
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
    name: 'conversation',
    path: '/conversation/:station/:id',
    hideInMenu: true,
    icon: 'smile',
    component: './Conversation',
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
