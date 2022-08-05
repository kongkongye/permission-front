import EditForm from '@/components/EditForm';
import {pagePerTypes, savePerType} from '@/services/permission/api';
import type {
  ActionType,
  FormInstance, ProColumns,
  ProFormInstance} from '@ant-design/pro-components';
import {
  ProTable
} from '@ant-design/pro-components';
import {Dropdown, Layout, Menu, message} from 'antd';
import {Content} from 'antd/es/layout/layout';
import type {Key} from 'antd/es/table/interface';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useModel} from "@umijs/max";
import {DownOutlined} from "@ant-design/icons";
import PerTypeForm from "@/pages/Permission/PerTypeManage/components/PerTypeForm";

const PerTypeManage: React.FC = () => {
  const {perTypes, refresh} = useModel('usePerTypes')
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const newFormRef = useRef<ProFormInstance>();
  const editFormRef = useRef<ProFormInstance>();
  const [selectedKeys] = useState<Key[]>([]);
  const sel = useMemo(() => perTypes[selectedKeys[0]], [perTypes, selectedKeys])
  const [selPerType, setSelPerType] = useState<PerAPI.PerType>();
  const [editVisible, setEditVisible] = React.useState(false);
  const editCallback = useCallback((perType) => {
    setSelPerType(perType);
    setEditVisible(true);
  }, []);

  const columns: ProColumns<PerAPI.PerType>[] = [
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
      title: '筛选',
      dataIndex: 'filter',
      hideInSearch: true,
      width: 300,
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
      <Content>
        <ProTable
          headerTitle='权限列表'
          actionRef={actionRef}
          formRef={formRef}
          rowKey="code"
          columns={columns}
          request={(params: any, sort: any, filter: any) => {
            return pagePerTypes({
              ...params
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
                title="权限"
                isEdit={false}
                onVisibleChange={(visible) => {
                  if (visible) {
                    newFormRef.current?.setFieldsValue({
                      code: sel?.code,
                    });
                  }
                }}
                onFinish={async (formData) => {
                  await savePerType(formData);
                  refresh();
                  actionRef.current?.reload()
                  message.success('添加成功！');
                  return true;
                }}
              >
                <PerTypeForm parent={sel}/>
              </EditForm>,
              <EditForm
                key='edit'
                visible={editVisible}
                onVisibleChange={(visible) => {
                  if (visible) {
                    editFormRef.current?.setFieldsValue(selPerType);
                  }
                }}
                formRef={editFormRef}
                id={selPerType?.code}
                idLabel="编码"
                title="权限"
                isEdit={true}
                onFinish={async (formData) => {
                  await savePerType(formData);
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
                <PerTypeForm isEdit parent={selPerType?.code?perTypes[selPerType?.code]:null}/>
              </EditForm>,
            ],
          }}
        />
      </Content>
    </Layout>
  );
};

export default PerTypeManage;
