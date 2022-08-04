// @ts-ignore
/* eslint-disable */

declare namespace PerAPI {
  type Dept = {
    id: number;
    code: string;
    name: string;
    parent?: string;
    note?: string;

    key?: string;
    title?: string;
    value?: string;
  };
  type Role = {
    id: number;
    deptCode?: string;
    code: string;
    name: string;
    note?: string;
  };
  type UserRole = {
    id: number;
    userCode: string;
    roleCode: string;
  };
  type User = {
    id: number;
    code: string;
    name: string;
    note?: string;
    disabled?: boolean;
  };
  type BizDir = {
    id: number;
    code: string;
    name: string;
    parent?: string;
    note?: string;
  };
  type Biz = {
    id: number;
    dirCode?: string;
    code: string;
    name: string;
    note?: string;
  };
  type PerType = {
    id: number;
    code: string;
    name: string;
    note?: string;
    filter?: string;
    bizCode?: string;
  };
  type PerValue = {
    id: number;
    typeCode: string;
    code: string;
    name: string;
    parent?: string;
    note?: string;
    filterCode?: string;

    key?: string;
    title?: string;
    label?: string;
    value?: string;
  };
  type PerBind = {
    id: number;
    bizCode?: string;
    bindType: string;
    bindCode: string;
    perCode: string;
  };
  type PerBindBrief = {
    perCode: string;
  };
  type BizPerType = {
    id: number;
    bizCode: string;
    perTypeCode: string;
  };
}
