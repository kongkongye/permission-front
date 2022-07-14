import {useListBizDirs} from '@/services/permission/api';
import {listToTree} from '@/util/util';
import {useEffect, useState} from 'react';
import {useModel} from "@@/exports";

const useBizDirs = () => {
  const [codes, setCodes] = useState<{ [key: string]: any }>({});
  const [treeData, setTreeData] = useState<any[]>([]);
  const {initialState} = useModel('@@initialState');
  const {data, refresh} = useListBizDirs(!!initialState?.currentUser);

  useEffect(() => {
    if (data) {
      for (const e of data) {
        e.key = e.code;
        e.title = e.name;
        e.value = e.code;
      }

      //codes
      const codes_ = {};
      for (const e of data) {
        codes_[e.code] = e;
      }
      setCodes(codes_);

      //treeData
      const treeData_ = listToTree(data, 'code', 'parent', 'children');
      setTreeData(treeData_);
    }
  }, [data]);

  return {codes, treeData, refresh};
};

export default useBizDirs;
