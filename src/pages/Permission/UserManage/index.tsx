import EditForm from '@/components/EditForm';
import UserForm from '@/pages/Permission/UserManage/components/UserForm';
import { disableUser, pageUsers, saveUser } from '@/services/permission/api';
import { DownOutlined } from '@ant-design/icons';
import {
  ActionType,
  FormInstance,
  ProColumns,
  ProFormInstance,
  ProFormSwitch,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Dropdown,
  Menu,
  message,
  Modal,
  Popconfirm,
  Popover,
  Space,
  TreeSelect,
} from 'antd';
import React, { useCallback, useRef } from 'react';
import { useModel } from '@umijs/max';
import UserDeptManage from '@/pages/Permission/UserManage/components/UserDeptManage';
import UserRoleManage from '@/pages/Permission/UserManage/components/UserRoleManage';

const UserManage: React.FC = () => {
  const { depts, treeData, refresh } = useModel('useDepts');
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [sel, setSel] = React.useState<PerAPI.User>();
  const [editVisible, setEditVisible] = React.useState(false);
  const [userDeptManageVisible, setUserDeptManageVisible] = React.useState(false);
  const [userRoleManageVisible, setUserRoleManageVisible] = React.useState(false);
  const selectCallback = useCallback((value: any) => {
    formRef.current?.setFieldsValue({
      searchDept: value,
    });
  }, []);
  const newFormRef = useRef<ProFormInstance>();
  const editFormRef = useRef<ProFormInstance>();
  const editCallback = useCallback((user) => {
    setSel(user);
    setEditVisible(true);
    // editFormRef.current?.setFieldsValue(user);
  }, []);
  const userDeptManageCallback = useCallback((user) => {
    setSel(user);
    setUserDeptManageVisible(true);
  }, []);
  const userRoleManageCallback = useCallback((user) => {
    setSel(user);
    setUserRoleManageVisible(true);
  }, []);
  const disableCallback = useCallback((user) => {
    const disabled = user.disabled;
    Modal.confirm({
      title: `确认 ${disabled ? '启用' : '禁用'} 用户'${user.name}'吗？`,
      onOk: async () => {
        await disableUser(user.id, !disabled);
        actionRef.current?.reload();
        message.success(disabled ? '启用成功！' : '禁用成功！');
      },
    });
  }, []);

  const columns: ProColumns<PerAPI.User>[] = [
    {
      title: '所属部门',
      dataIndex: 'searchDept',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Popover
            placement="left"
            trigger="click"
            content={<ProFormSwitch label="包含子部门" name="containSubDept" />}
          >
            {treeData && treeData.length > 0 && (
              <TreeSelect
                allowClear
                treeData={treeData}
                onChange={selectCallback}
                treeDefaultExpandAll
              />
            )}
          </Popover>
        );
      },
    },
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '禁用',
      dataIndex: 'disabled',
      valueEnum: {
        true: { text: '禁用', status: 'Error' },
        false: { text: '启用', status: 'Success' },
      },
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
          key="1"
          icon={<DownOutlined />}
          overlay={
            <Menu
              items={[
                {
                  key: '2',
                  label: (
                    <span
                      onClick={() => {
                        userDeptManageCallback(entity);
                      }}
                    >
                      部门设置
                    </span>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <span
                      onClick={() => {
                        userRoleManageCallback(entity);
                      }}
                    >
                      角色设置
                    </span>
                  ),
                },
                {
                  key: '4',
                  label: (
                    <span
                      onClick={() => {
                        disableCallback(entity);
                      }}
                    >
                      {entity.disabled ? '启用' : '禁用'}
                    </span>
                  ),
                },
              ]}
            />
          }
          onClick={() => editCallback(entity)}
        >
          编辑
        </Dropdown.Button>,
      ],
    },
  ];

  return (
    <ProTable
      headerTitle="用户列表"
      actionRef={actionRef}
      formRef={formRef}
      rowKey="code"
      columns={columns}
      request={pageUsers}
      defaultSize="small"
      pagination={{
        showSizeChanger: true,
      }}
      toolbar={{
        actions: [
          <EditForm
            key="new"
            formRef={newFormRef}
            title="用户"
            isEdit={false}
            onFinish={async (formData) => {
              await saveUser(formData);
              refresh();
              actionRef.current?.reload();
              message.success('添加成功！');
              return true;
            }}
          >
            <UserForm />
          </EditForm>,
          <EditForm
            key="edit"
            visible={editVisible}
            onVisibleChange={(visible) => {
              if (visible) {
                editFormRef.current?.setFieldsValue(sel);
              }
            }}
            formRef={editFormRef}
            id={sel?.code}
            idLabel="编码"
            title="用户"
            isEdit={true}
            onFinish={async (formData) => {
              await saveUser(formData);
              setEditVisible(false);
              refresh();
              actionRef.current?.reload();
              message.success('更新成功！');
              return true;
            }}
            modalProps={{
              onCancel: () => {
                setEditVisible(false);
              },
            }}
            noTrigger
          >
            <UserForm isEdit />
          </EditForm>,
          <UserDeptManage
            key="userDept"
            user={sel}
            onClose={() => {
              setUserDeptManageVisible(false);
            }}
            visible={userDeptManageVisible}
          />,
          <div key="userRole">
            {userRoleManageVisible && (
              <UserRoleManage
                user={sel}
                onClose={() => {
                  setUserRoleManageVisible(false);
                }}
                visible={userRoleManageVisible}
              />
            )}
          </div>,
        ],
      }}
    />
  );
};

export default UserManage;
