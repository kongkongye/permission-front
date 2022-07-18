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
    path: '/biz-dir-manage',
    name: 'biz-dir-manage',
    icon: 'apartment',
    component: './Permission/BizDirManage',
  },
  {
    path: '/biz-manage',
    name: 'biz-manage',
    icon: 'apartment',
    component: './Permission/BizManage',
  },
  {
    path: '/per-manage',
    name: 'per-manage',
    icon: 'apartment',
    component: './Permission/PerManage',
  },
  {
    path: '/per-bind-manage',
    name: 'per-bind-manage',
    icon: 'apartment',
    component: './Permission/PerBindManage',
  },
  {
    path: '/system-manage',
    name: 'system-manage',
    icon: 'apartment',
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
