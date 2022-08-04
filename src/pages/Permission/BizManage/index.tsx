import EditForm from '@/components/EditForm';
import { pageBiz, saveBiz } from '@/services/permission/api';
import {
  ActionType,
  FormInstance,
  ProColumns,
  ProFormGroup,
  ProFormInstance,
  ProFormSwitch,
  ProTable,
} from '@ant-design/pro-components';
import { Dropdown, Layout, Menu, message, Space, Tree } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Key } from 'antd/es/table/interface';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import styles from './index.less';
import { useModel } from '@umijs/max';
import { DownOutlined } from '@ant-design/icons';
import BizForm from '@/pages/Permission/BizManage/components/BizForm';
import BizPerTypeManage from '@/pages/Permission/BizManage/components/BizPerTypeManage';

const BizManage: React.FC = () => {
  const { codes, treeData, refresh } = useModel('useBizDirs');
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [containSubDir, setContainSubDir] = useState(false);
  const newFormRef = useRef<ProFormInstance>();
  const editFormRef = useRef<ProFormInstance>();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const sel = useMemo(() => codes[selectedKeys[0]], [codes, selectedKeys]);
  const [selBiz, setSelBiz] = useState<PerAPI.Biz>();
  const [editVisible, setEditVisible] = React.useState(false);
  const [bizPerTypeManageVisible, setBizPerTypeManageVisible] = React.useState(false);
  const userDeptManageCallback = useCallback((biz) => {
    setSelBiz(biz);
    setBizPerTypeManageVisible(true);
  }, []);
  const containSubDirCallback = useCallback((checked) => {
    setContainSubDir(checked);
    // @ts-ignore
    actionRef.current?.reloadAndRest();
  }, []);
  const selectDirCallback = useCallback((keys, info) => {
    setSelectedKeys(keys);
    // @ts-ignore
    actionRef.current?.reloadAndRest();
  }, []);
  const editCallback = useCallback((biz) => {
    setSelBiz(biz);
    setEditVisible(true);
  }, []);

  const columns: ProColumns<PerAPI.Biz>[] = [
    {
      title: '所属目录',
      dataIndex: 'dirCode',
      renderText: (text, record) => {
        return codes[text]?.name || text;
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
                      权限类型设置
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
    <Layout>
      <Layout.Sider className={styles.sider}>
        <h3>目录列表</h3>
        <ProFormGroup>
          <ProFormSwitch
            label="包含子目录"
            fieldProps={{
              onChange: containSubDirCallback,
            }}
          />
        </ProFormGroup>
        <div className={styles.treeWrapper}>
          {treeData && treeData.length > 0 && (
            <Tree.DirectoryTree
              selectedKeys={selectedKeys}
              className={styles.tree}
              treeData={treeData}
              onSelect={selectDirCallback}
              defaultExpandAll
              expandAction="doubleClick"
            />
          )}
        </div>
      </Layout.Sider>
      <Content>
        <ProTable
          headerTitle="业务对象列表"
          actionRef={actionRef}
          formRef={formRef}
          rowKey="code"
          columns={columns}
          request={(params: any, sort: any, filter: any) => {
            return pageBiz(
              {
                ...params,
                searchDir: sel?.code,
                containSubDir,
              },
              sort,
              filter,
            );
          }}
          defaultSize="small"
          pagination={{
            showSizeChanger: true,
          }}
          toolbar={{
            actions: [
              <EditForm
                key="new"
                formRef={newFormRef}
                title="业务对象"
                isEdit={false}
                onVisibleChange={(visible) => {
                  if (visible) {
                    newFormRef.current?.setFieldsValue({
                      dirCode: sel?.code,
                    });
                  }
                }}
                onFinish={async (formData) => {
                  await saveBiz(formData);
                  refresh();
                  actionRef.current?.reload();
                  message.success('添加成功！');
                  return true;
                }}
              >
                <BizForm parent={sel} />
              </EditForm>,
              <EditForm
                key="edit"
                visible={editVisible}
                onVisibleChange={(visible) => {
                  if (visible) {
                    editFormRef.current?.setFieldsValue(selBiz);
                  }
                }}
                formRef={editFormRef}
                id={selBiz?.code}
                idLabel="编码"
                title="业务对象"
                isEdit={true}
                onFinish={async (formData) => {
                  await saveBiz(formData);
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
                <BizForm isEdit parent={selBiz?.dirCode ? codes[selBiz?.dirCode] : null} />
              </EditForm>,
              <BizPerTypeManage
                key="bizPerType"
                biz={selBiz}
                onClose={() => {
                  setBizPerTypeManageVisible(false);
                }}
                visible={bizPerTypeManageVisible}
              />,
            ],
          }}
        />
      </Content>
    </Layout>
  );
};

export default BizManage;
