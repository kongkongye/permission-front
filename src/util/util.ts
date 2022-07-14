import {RequestData} from "@ant-design/pro-components";

/**
 * 获取从tree根到node的路径
 * @param tree
 * @param node
 * @return []
 */
export function getTreePath<T extends {
  parent: string
}>(codes: { [key: string]: T }, node?: T): T[] {
  const routes: T[] = []
  let check = node
  do {
    if (check) {
      routes.unshift(check)
      check = codes[check.parent]
    }
  } while (check)
  return routes
}

export function listToTree(list: any[], idKey: string, parentKey: string, childrenKey: string) {
  const map = {},
    roots = [];
  let node, i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i][idKey]] = i; // initialize the map
    list[i][childrenKey] = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node[parentKey]) {
      // if you have dangling branches check that map[node.parentId] exists
      const listElement = list[map[node[parentKey]]];
      if (listElement) {
        listElement[childrenKey].push(node);
      }
    } else {
      roots.push(node);
    }
  }
  return roots;
}

/**
 * 解析页面结果
 * (ProTable可直接用的)
 */
export const parsePage = <T>(data: Common.Pagination<T> | undefined): RequestData<T> => {
  return {
    success: true,
    total: data?.total || 0,
    data: data?.dataList || [],
  };
};

/**
 * 处理搜索条件
 * @param params 搜索条件
 * @param addWildcardParams 添加通配符的搜索条件
 */
export const handleSearchParams = (params: any, addWildcardParams?: any[]) => {
  //addWildcardParams
  if (addWildcardParams) {
    for (const paramName of addWildcardParams) {
      const param = params[paramName];
      if (param) {
        params[paramName] = `%${param}%`;
      }
    }
  }
  return params
}
