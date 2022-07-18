import {useListPerValueBriefs} from '@/services/permission/api';
import {listToTree} from '@/util/util';
import {useEffect, useState} from 'react';

/**
 * 因为有typeCode参数，因此不能放models目录内，不能搞成全局的
 */
const usePerValueBriefs = (typeCode?: string, filterCode?: string, filterContainSub?: boolean) => {
  const {data, refresh} = useListPerValueBriefs(typeCode, filterCode, filterContainSub);
  const [codes, setCodes] = useState<{ [key: string]: any }>({});
  const [treeData, setTreeData] = useState<any[]>([]);

  // //typeCode变了就刷新
  // useEffect(() => {
  //   refresh()
  // }, [typeCode])
  useEffect(() => {
    if (data) {
      for (const e of data) {
        e.key = e.code;
        e.title = e.name;
        e.label = e.name;
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

export default usePerValueBriefs;
