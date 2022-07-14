// @ts-ignore
/* eslint-disable */

declare namespace Common {
  type Result<T> = {
    success: boolean;
    code: string;
    message?: string;
    map?: {
      data?: T;
      [key: string]: any;
    };
  };
  type Pagination<T> = {
    dataList: T[];
    total: number;
  };
}
