import {Button, Layout, Tree} from 'antd';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useModel} from "@umijs/max";
import {getTreePath} from "@/util/util";
import styles from "./BindNodeSelRole.less";
import {
  ActionType,
  FormInstance, ProColumns,
  ProFormGroup,
  ProFormSwitch,
  ProTable
} from "@ant-design/pro-components";
import {Content} from "antd/es/layout/layout";
import {pageRoles} from "@/services/permission/api";
import {Key} from "antd/es/table/interface";

type Props = {
  onSel: (routes: PerAPI.Dept[], deptCode: PerAPI.Role) => void;
}

const BindNodeSelRole: React.FC<Props> = (props: Props) => {
  const {onSel} = props

  const {depts, treeData, refresh} = useModel('useDepts')
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [containSubDept, setContainSubDept] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const sel = useMemo(() => depts[selectedKeys[0]], [depts, selectedKeys])
  const containSubDeptCallback = useCallback((checked) => {
    setContainSubDept(checked)
    // @ts-ignore
    actionRef.current?.reloadAndRest()
  }, [])
  const selectDeptCallback = useCallback((keys, info) => {
    setSelectedKeys(keys)
    // @ts-ignore
    actionRef.current?.reloadAndRest()
  }, [])

  const columns: ProColumns<PerAPI.Role>[] = [
    {
      title: '所属部门',
      dataIndex: 'deptCode',
      renderText: (text, record) => {
        return depts[text]?.name || text
      },
      hideInSearch: true,
    },
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '备注',
      dataIndex: 'note',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (dom, entity) => [
        <Button key='1' size='small' type='primary' onClick={() => {
          onSel(getTreePath(depts, entity.deptCode ? depts[entity.deptCode] : null), entity)
        }}>选择</Button>,
      ],
    },
  ];

  return (
    <Layout>
      <Layout.Sider className={styles.sider}>
        <h3>部门列表</h3>
        <ProFormGroup>
          <ProFormSwitch label='包含子部门' fieldProps={{
            onChange: containSubDeptCallback
          }}/>
        </ProFormGroup>
        <div className={styles.treeWrapper}>
          {treeData && treeData.length > 0 && (
            <Tree.DirectoryTree
              selectedKeys={selectedKeys}
              className={styles.tree}
              treeData={treeData}
              onSelect={selectDeptCallback}
              defaultExpandAll
              expandAction="doubleClick"
            />
          )}
        </div>
      </Layout.Sider>
      <Content>
        <ProTable
          headerTitle='角色列表'
          actionRef={actionRef}
          formRef={formRef}
          rowKey="code"
          columns={columns}
          request={(params: any, sort: any, filter: any) => {
            return pageRoles({
              ...params,
              searchDept: sel?.code,
              containSubDept,
            }, sort, filter)
          }}
          defaultSize="small"
          pagination={{
            showSizeChanger: true,
          }}
          toolbar={{
            actions: [
            ],
          }}
        />
      </Content>
    </Layout>
  );
};

export default BindNodeSelRole;
