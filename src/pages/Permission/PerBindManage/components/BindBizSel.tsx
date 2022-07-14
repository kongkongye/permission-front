import {
  ActionType,
  FormInstance,
  ModalFormProps, ProColumns,
  ProFormGroup, ProFormSwitch,
  ProTable
} from '@ant-design/pro-components';
import {Button, Layout, Modal, Tree} from 'antd';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import styles from './BindBizSel.less'
import {Key} from "antd/es/table/interface";
import {useModel} from "@@/exports";
import {
  pageBiz
} from "@/services/permission/api";
import {Content} from "antd/es/layout/layout";
import {getTreePath} from "@/util/util";

type Props<T = Record<string, any>> = ModalFormProps<T> & {
  visible: boolean;
  onSel: (bizDirs?: PerAPI.BizDir[], biz?: PerAPI.Biz) => void;
  onClose: () => void;
};

const Index: React.FC<Props<any>> = <T, >(props: Props<T>) => {
  const {visible, onSel, onClose} = props;

  const {codes, treeData} = useModel('useBizDirs')
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [containSubDir, setContainSubDir] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const sel = useMemo(() => codes[selectedKeys[0]], [codes, selectedKeys])
  const containSubDirCallback = useCallback((checked) => {
    setContainSubDir(checked)
    // @ts-ignore
    actionRef.current?.reloadAndRest()
  }, [])
  const selectDirCallback = useCallback((keys, info) => {
    setSelectedKeys(keys)
    // @ts-ignore
    actionRef.current?.reloadAndRest()
  }, [])

  const columns: ProColumns<PerAPI.Biz>[] = [
    {
      title: '所属目录',
      dataIndex: 'dirCode',
      renderText: (text, record) => {
        return codes[text]?.name || text
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
          onSel(getTreePath(codes, entity.dirCode ? codes[entity.dirCode] : null), entity)
        }}>选择</Button>,
      ],
    },
  ];

  return (
    <Modal
      visible={visible}
      width='80%'
      title={<div>
        <span>选择业务对象</span>
        <Button size='small' type='link' onClick={() => {
          onSel()
        }
        }>取消选择</Button>
      </div>}
      footer={null}
      onCancel={onClose}
    >
      <Layout className={styles.container}>
        <Layout.Sider className={styles.sider}>
          <h3>目录列表</h3>
          <ProFormGroup>
            <ProFormSwitch label='包含子目录' fieldProps={{
              onChange: containSubDirCallback
            }}/>
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
            headerTitle='业务对象列表'
            actionRef={actionRef}
            formRef={formRef}
            rowKey="code"
            columns={columns}
            request={(params: any, sort: any, filter: any) => {
              return pageBiz({
                ...params,
                searchDir: sel?.code,
                containSubDir,
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
