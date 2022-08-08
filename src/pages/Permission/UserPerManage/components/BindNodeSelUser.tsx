import {
  ActionType,
  FormInstance,
  ModalFormProps, ProColumns,
  ProTable
} from '@ant-design/pro-components';
import {Button, Layout, Modal, Tree} from 'antd';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import styles from './BindBizSel.less'
import {
  pageUsers
} from "@/services/permission/api";
import {Content} from "antd/es/layout/layout";

type Props<T = Record<string, any>> = ModalFormProps<T> & {
  visible: boolean;
  onSel: ( user?: PerAPI.User) => void;
  onClose: () => void;
};

const Index: React.FC<Props<any>> = <T, >(props: Props<T>) => {
  const {visible, onSel, onClose} = props;

  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();


  const columns: ProColumns<PerAPI.User>[] = [
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
          onSel(entity)
        }}>选择</Button>,
      ],
    },
  ];

  return (
    <Modal
      visible={visible}
      width='80%'
      title={<div>
        <span>选择用户</span>
      </div>}
      footer={null}
      onCancel={onClose}
    >
      <Layout className={styles.container}>
        <Content>
          <ProTable
            headerTitle='用户列表'
            actionRef={actionRef}
            formRef={formRef}
            rowKey="code"
            columns={columns}
            request={(params: any, sort: any, filter: any) => {
              return pageUsers({
                ...params,
              }, sort, filter)
            }}
            defaultSize="small"
            pagination={{
              showSizeChanger: true,
            }}
            toolbar={{
              actions: [],
            }}
          />
        </Content>
      </Layout>
    </Modal>
  );
};

export default Index;
