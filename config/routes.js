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
    icon: 'DeploymentUnitOutlined',
    component: './Stations',
  },
  {
    path: '/notifications',
    name: 'fireReports',
    icon: 'bell',
    hideInMenu: true,
    component: './Cases/Notifications',
  },
  {
    path: '/warning-messages',
    name: 'warning',
    icon: 'bell',
    hideInMenu: true,
    component: './Cases/Warnings',
  },
  {
    path: '/cases',
    name: 'cases',
    icon: 'FolderOutlined',
    component: './Cases/Notifications',
     routes: [
       {
        path: '/notifications',
        name: 'fireReports',
        icon: 'bell',
        component: './Cases/Notifications',
      },
      {
        path: '/warning-messages',
        name: 'warning',
        icon: 'bell',
        component: './Cases/Warnings',
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
