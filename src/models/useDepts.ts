import {useListDepts} from '@/services/permission/api';
import {listToTree} from '@/util/util';
import {useEffect, useState} from 'react';
import {useModel} from "@umijs/max";

const useDepts = () => {
  const [depts, setDepts] = useState<{ [key: string]: any }>({});
  const [treeData, setTreeData] = useState<any[]>([]);
  const {initialState} = useModel('@@initialState');
  const {data, refresh} = useListDepts(!!initialState?.currentUser);

  useEffect(() => {
    if (data) {
      for (const e of data) {
        e.key = e.code;
        e.title = e.name;
        e.value = e.code;
      }

      //depts
      const depts_ = {};
      for (const e of data) {
        depts_[e.code] = e;
      }
      setDepts(depts_);

      //treeData
      const treeData_ = listToTree(data, 'code', 'parent', 'children');
      setTreeData(treeData_);
    }
  }, [data]);

  return {depts, treeData, refresh};
};

export default useDepts;
