// @ts-ignore
/* eslint-disable */
import { usePost } from '@/hooks/useReq';
import { post } from '@/util/req';
import { handleSearchParams, parsePage } from '@/util/util';
import qs from 'qs';

export function useListDepts(ready: boolean = false) {
  return usePost<PerAPI.Dept[]>(
    '/admin/dept/query',
    {
      data: qs.stringify({
        qType: 'list',
      }),
    },
    {
      ready,
    },
  );
}

export function useListPerValues(typeCode?: string) {
  return usePost<PerAPI.PerValue[]>('/admin/per/queryPerValue', {
    data: qs.stringify({
      typeCode: typeCode || 'none',
      qType: 'list',
    }),
  });
}

export function useListPerValueBriefs(
  typeCode?: string,
  filterCode?: string,
  filterContainSub?: boolean,
) {
  return usePost<PerAPI.PerValue[]>(
    '/admin/per/queryPerValueBrief',
    {
      data: qs.stringify({
        typeCode: typeCode || 'none',
        filterCodes: filterCode ? JSON.stringify([filterCode]) : null,
        filterContainSub,
        qType: 'list',
      }),
    },
    {
      refreshDeps: [typeCode, filterCode, filterContainSub],
    },
  );
}

export async function saveDept(data: PerAPI.Dept) {
  return post('/admin/dept/save', {
    data: qs.stringify(data),
  });
}

export async function delDept(id: number) {
  return post('/admin/dept/del', {
    data: qs.stringify({
      id,
    }),
  });
}

export async function pageRoles(params: any, sort: any, filter: any) {
  const { pageSize, current: page, searchDept, ...searchParams } = params;
  if (searchDept) {
    searchParams.deptCodes = JSON.stringify([searchDept]);
  }
  const searchParamsHandled = handleSearchParams(searchParams, ['code', 'name']);
  return post<Common.Pagination<PerAPI.Role>>('/admin/role/query', {
    data: qs.stringify({
      ...searchParamsHandled,
      pageSize,
      page,
      qType: 'page',
    }),
  }).then(parsePage);
}

export async function saveRole(data: PerAPI.Role) {
  return post('/admin/role/save', {
    data: qs.stringify(data),
  });
}

export async function pageUsers(params: any, sort: any, filter: any) {
  // console.log(params, sort, filter);
  const { pageSize, current: page, searchDept, ...searchParams } = params;
  if (searchDept) {
    searchParams.deptCodes = JSON.stringify([searchDept]);
  }
  const searchParamsHandled = handleSearchParams(searchParams, ['code', 'name', 'nickname']);
  return post<Common.Pagination<PerAPI.User>>('/auth/user/query', {
    data: qs.stringify({
      ...searchParamsHandled,
      pageSize,
      page,
      qType: 'page',
    }),
  })
    .then(parsePage)
    .then((res) => {
      for (const e of res.data!) {
        e.disabled = !!e.disabled;
      }
      return res;
    });
}

export async function queryUserDepts(userCode: string) {
  return post('/auth/user/queryUserDepts', {
    data: qs.stringify({
      userCode,
    }),
  });
}

export async function saveUser(data: PerAPI.User) {
  return post('/admin/user/save', {
    data: qs.stringify(data),
  });
}

export async function disableUser(userId: number, disable: boolean) {
  return post('/admin/user/disable', {
    data: qs.stringify({
      userId,
      disable,
    }),
  });
}

export async function addUserRole(userCode: string, roleCode: string) {
  return post('/admin/user/addUserRole', {
    data: qs.stringify({
      userCode,
      roleCode,
    }),
  });
}

export async function delUserRole(userCode: string, roleCode: string) {
  return post('/admin/user/delUserRole', {
    data: qs.stringify({
      userCode,
      roleCode,
    }),
  });
}

export async function setUserDepts(userCode: string, deptCodes: string[]) {
  return post('/admin/user/setUserDepts', {
    data: qs.stringify({
      userCode,
      deptCodesStr: JSON.stringify(deptCodes),
    }),
  });
}

export async function listUserRoles(params: any, sort: any, filter: any) {
  return post<PerAPI.UserRole[]>('/admin/user/queryUserRole', {
    data: qs.stringify({
      ...params,
      qType: 'list',
    }),
  });
}

export function useListBizDirs(ready: boolean = false) {
  return usePost<PerAPI.Dept[]>(
    '/admin/per/queryBizDir',
    {
      data: qs.stringify({
        qType: 'list',
      }),
    },
    {
      ready,
    },
  );
}

export async function saveBizDir(data: PerAPI.BizDir) {
  return post('/admin/per/saveBizDir', {
    data: qs.stringify(data),
  });
}

export async function saveBiz(data: PerAPI.Biz) {
  return post('/admin/per/saveBiz', {
    data: qs.stringify(data),
  });
}

export async function pageBiz(params: any, sort: any, filter: any) {
  const { pageSize, current: page, searchDir, ...searchParams } = params;
  if (searchDir) {
    searchParams.dirCodes = JSON.stringify([searchDir]);
  }
  const searchParamsHandled = handleSearchParams(searchParams, ['code', 'name']);
  return post<Common.Pagination<PerAPI.Role>>('/admin/per/queryBiz', {
    data: qs.stringify({
      ...searchParamsHandled,
      pageSize,
      page,
      qType: 'page',
    }),
  }).then(parsePage);
}

export function listPerTypes(params: any) {
  return post<PerAPI.PerType[]>('/admin/per/queryPerType', {
    data: qs.stringify({
      ...params,
      qType: 'list',
    }),
  });
}

export async function savePerValue(data: PerAPI.PerValue) {
  return post('/admin/per/savePerValue', {
    data: qs.stringify(data),
  });
}

export async function listPerValues(params: any, sort: any, filter: any) {
  const { ...searchParams } = params;
  const searchParamsHandled = handleSearchParams(searchParams, ['code', 'name']);
  return post<PerAPI.PerValue[]>('/admin/per/queryPerValue', {
    data: qs.stringify({
      ...searchParamsHandled,
      qType: 'list',
    }),
  });
}

export async function getPerValue(params: any) {
  return post<PerAPI.PerValue[]>('/admin/per/queryPerValue', {
    data: qs.stringify({
      ...params,
      qType: 'get',
    }),
  });
}

export async function listPerBindBriefs(params: any) {
  return post<PerAPI.PerBindBrief[]>('/admin/per/queryPerBindBrief', {
    data: qs.stringify({
      ...params,
      qType: 'list',
    }),
  });
}

export async function addPerBind(
  bindType: string,
  bindCode: string,
  typeCode: string,
  perCode: string,
  bizCode?: string,
) {
  return post('/admin/per/addPerBind', {
    data: qs.stringify({
      bizCode,
      bindType,
      bindCode,
      typeCode,
      perCode,
    }),
  });
}

export async function delPerBind(
  bindType: string,
  bindCode: string,
  typeCode: string,
  perCode: string,
  bizCode?: string,
) {
  return post('/admin/per/delPerBind', {
    data: qs.stringify({
      bizCode,
      bindType,
      bindCode,
      typeCode,
      perCode,
    }),
  });
}

export async function listBizPerType(params: any, sort: any, filter: any) {
  return post<PerAPI.BizPerType[]>('/admin/per/queryBizPerType', {
    data: qs.stringify({
      ...params,
      qType: 'list',
    }),
  });
}

export async function addBizPerType(bizCode: string, perTypeCode: string) {
  return post('/admin/per/addBizPerType', {
    data: qs.stringify({
      bizCode,
      perTypeCode,
    }),
  });
}

export async function delBizPerType(bizCode: string, perTypeCode: string) {
  return post('/admin/per/delBizPerType', {
    data: qs.stringify({
      bizCode,
      perTypeCode,
    }),
  });
}

export async function pagePerTypes(params: any, sort: any, filter: any) {
  const { pageSize, current: page, ...searchParams } = params;
  const searchParamsHandled = handleSearchParams(searchParams, ['code', 'name']);
  return post<Common.Pagination<PerAPI.PerType>>('/admin/per/queryPerType', {
    data: qs.stringify({
      ...searchParamsHandled,
      pageSize,
      page,
      qType: 'page',
    }),
  }).then(parsePage);
}
