import {
  ActionType,
  FormInstance,
  ModalFormProps,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Layout, message, Modal } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './BizPerTypeManage.less';
import { Key } from 'antd/es/table/interface';

import {
  listBizPerType,
  addBizPerType,
  delBizPerType,
  pagePerTypes,
} from '@/services/permission/api';
import { Content } from 'antd/es/layout/layout';

type Props<T = Record<string, any>> = ModalFormProps<T> & {
  biz?: PerAPI.Biz;
  onClose: () => void;
};
const Index: React.FC<Props<any>> = <T,>(props: Props<T>) => {
  const { biz, onClose, ...otherProps } = props;
  const actionRef = useRef<ActionType>();
  const [perTypes, setPerTypes] = useState({});
  useEffect(() => {
    if (biz) {
      listBizPerType({ bizCode: biz?.code }, null, null).then((res) => {
        const perType_ = {};
        if (res) {
          for (const e of res) {
            perType_[e.perTypeCode] = true;
          }
        }
        setPerTypes(perType_);
      });
    }
  }, [biz]);

  const formRef = useRef<FormInstance>();
  const [checkedList, setCheckedList] = useState<Key[]>([]);

  const selectCallback = useCallback(
    async (record, selected) => {
      if (biz) {
        if (selected) {
          await addBizPerType(biz.code, record.code);
          setCheckedList([...checkedList, record.code]);
          setPerTypes({ ...perTypes, [record.code]: true });
          message.success('添加权限类型成功：' + record.name);
        } else {
          await delBizPerType(biz.code, record.code);
          setCheckedList(checkedList.filter((e) => e !== record.code));
          setPerTypes({ ...perTypes, [record.code]: false });
          message.success('删除权限类型成功：' + record.name);
        }
      }
    },
    [biz, checkedList, perTypes],
  );
  const dataChangeCallback = useCallback(
    (data: any[]) => {
      const checkedList_ = [];
      for (const e of data) {
        if (perTypes[e.code]) {
          checkedList_.push(e.code);
        }
      }
      setCheckedList(checkedList_);
      console.log('checked>', JSON.stringify(checkedList_));
    },
    [perTypes],
  );

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
      title: 'filter',
      dataIndex: 'filter',
      hideInSearch: true,
    },
  ];
  return (
    <Modal
      width="80%"
      title={
        <div>
          业务对象可见权限类型设置
          <span className={styles.subTitle}>(业务对象: {biz?.name})</span>
        </div>
      }
      destroyOnClose={true}
      footer={null}
      onCancel={onClose}
      {...otherProps}
    >
      <Layout className={styles.layout}>
        <Content>
          <ProTable
            headerTitle="权限类型列表"
            actionRef={actionRef}
            formRef={formRef}
            rowKey="code"
            columns={columns}
            request={(params: any, sort: any, filter: any) => {
              return pagePerTypes(
                {
                  ...params,
                },
                sort,
                filter,
              );
            }}
            defaultSize="small"
            pagination={{
              showSizeChanger: true,
            }}
            rowSelection={{
              hideSelectAll: true,
              checkStrictly: true,
              selectedRowKeys: checkedList,
              onSelect: selectCallback,
            }}
            onDataSourceChange={dataChangeCallback}
          />
        </Content>
      </Layout>
    </Modal>
  );
};

export default Index;
