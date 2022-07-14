import { Tree } from 'antd';
import React from 'react';
import {useModel} from "@umijs/max";
import {getTreePath} from "@/util/util";

type Props = {
  onSel: (routes: PerAPI.Dept[], deptCode: PerAPI.Dept) => void;
}

const BindNodeSelDept: React.FC<Props> = (props: Props) => {
  const {onSel} = props

  const {depts, treeData} = useModel('useDepts')
  return (
    <div>
      {treeData && treeData.length > 0 && (
        <Tree.DirectoryTree
          treeData={treeData}
          onSelect={(keys, info) => {
            onSel(getTreePath(depts, depts[keys[0]]), depts[keys[0]])
          }}
          defaultExpandAll
          expandAction="doubleClick"
        />
      )}
    </div>
  );
};

export default BindNodeSelDept;
