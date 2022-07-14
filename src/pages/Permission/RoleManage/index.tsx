import EditForm from '@/components/EditForm';
import {pageRoles, saveRole} from '@/services/permission/api';
import {
  ActionType,
  FormInstance, ProColumns,
  ProFormGroup,
  ProFormInstance,
  ProFormSwitch,
  ProTable
} from '@ant-design/pro-components';
import {Dropdown, Layout, Menu, message, Space, Tree} from 'antd';
import {Content} from 'antd/es/layout/layout';
import {Key} from 'antd/es/table/interface';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import styles from './index.less';
import {useModel} from "@umijs/max";
import RoleForm from "@/pages/Permission/RoleManage/components/RoleForm";
import {DownOutlined} from "@ant-design/icons";

const RoleManage: React.FC = () => {
  const {depts, treeData, refresh} = useModel('useDepts')
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [containSubDept, setContainSubDept] = useState(false)
  const newFormRef = useRef<ProFormInstance>();
  const editFormRef = useRef<ProFormInstance>();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const sel = useMemo(() => depts[selectedKeys[0]], [depts, selectedKeys])
  const [selRole, setSelRole] = useState<PerAPI.Role>();
  const [editVisible, setEditVisible] = React.useState(false);
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
  const editCallback = useCallback((role) => {
    setSelRole(role);
    setEditVisible(true);
  }, []);

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
        <Dropdown.Button
          key='1'
          icon={<DownOutlined/>}
          overlay={<Menu
            items={[]}
          />}
          onClick={() => editCallback(entity)}
        >
          编辑
        </Dropdown.Button>,
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
              <EditForm
                key='new'
                formRef={newFormRef}
                title="角色"
                isEdit={false}
                onVisibleChange={(visible) => {
                  if (visible) {
                    newFormRef.current?.setFieldsValue({
                      deptCode: sel?.code,
                    });
                  }
                }}
                onFinish={async (formData) => {
                  await saveRole(formData);
                  refresh();
                  actionRef.current?.reload()
                  message.success('添加成功！');
                  return true;
                }}
              >
                <RoleForm parent={sel}/>
              </EditForm>,
              <EditForm
                key='edit'
                visible={editVisible}
                onVisibleChange={(visible) => {
                  if (visible) {
                    editFormRef.current?.setFieldsValue(selRole);
                  }
                }}
                formRef={editFormRef}
                id={selRole?.code}
                idLabel="编码"
                title="角色"
                isEdit={true}
                onFinish={async (formData) => {
                  await saveRole(formData);
                  setEditVisible(false);
                  refresh();
                  actionRef.current?.reload()
                  message.success('更新成功！');
                  return true;
                }}
                modalProps={{
                  onCancel: () => {
                    setEditVisible(false);
                  }
                }}
                noTrigger
              >
                <RoleForm isEdit parent={selRole?.deptCode?depts[selRole?.deptCode]:null}/>
              </EditForm>,
            ],
          }}
        />
      </Content>
    </Layout>
  );
};

export default RoleManage;
