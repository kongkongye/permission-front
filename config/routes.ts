export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/dept-manage',
    name: 'dept-manage',
    icon: 'apartment',
    component: './Permission/DeptManage',
  },
  {
    path: '/role-manage',
    name: 'role-manage',
    icon: 'apartment',
    component: './Permission/RoleManage',
  },
  {
    path: '/user-manage',
    name: 'user-manage',
    icon: 'user',
    component: './Permission/UserManage',
  },
  {
    path: '/biz',
    name: 'biz',
    icon: 'folder',
    routes: [
      {
        path: '/biz/biz-dir-manage',
        name: 'biz-dir-manage',
        icon: 'apartment',
        component: './Permission/BizDirManage',
      },
      {
        path: '/biz/biz-manage',
        name: 'biz-manage',
        icon: 'apartment',
        component: './Permission/BizManage',
      },
    ]
  },
  {
    path: '/per',
    name: 'per',
    icon: 'appstore',
    routes: [
      {
        path: '/per/per-manage',
        name: 'per-manage',
        icon: 'apartment',
        component: './Permission/PerManage',
      },
      {
        path: '/per/per-bind-manage',
        name: 'per-bind-manage',
        icon: 'apartment',
        component: './Permission/PerBindManage',
      },
      {
        path: '/per/per-type-manage',
        name: 'per-type-manage',
        icon: 'apartment',
        component: './Permission/PerTypeManage',
      },
      {
        path: '/per/user-per-manage',
        name: 'user-per-manage',
        icon: 'apartment',
        component: './Permission/UserPerManage',
      },
    ]
  },
  {
    path: '/system-manage',
    name: 'system-manage',
    icon: 'setting',
    component: './Permission/SystemManage',
  },
  {
    path: '/',
    redirect: '/dept-manage',
  },
  {
    component: './404',
  },
];
