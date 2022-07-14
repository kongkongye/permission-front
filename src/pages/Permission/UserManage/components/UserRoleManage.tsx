import {
  ActionType,
  FormInstance,
  ModalFormProps, ProColumns,
  ProFormGroup, ProFormSwitch,
  ProTable
} from '@ant-design/pro-components';
import {Layout, message, Modal, Tree} from 'antd';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from './UserRoleManage.less'
import {Key} from "antd/es/table/interface";
import {useModel} from "@@/exports";
import {
  addUserRole,
  delUserRole, listUserRoles,
  pageRoles
} from "@/services/permission/api";
import {Content} from "antd/es/layout/layout";

type Props<T = Record<string, any>> = ModalFormProps<T> & {
  user?: PerAPI.User;
  onClose: () => void;
};

/**
 * 用户角色设置
 */
const Index: React.FC<Props<any>> = <T, >(props: Props<T>) => {
  const {
    user, onClose, ...otherProps
  } = props;

  const {depts, treeData, refresh} = useModel('useDepts')
  const [roles, setRoles] = useState({})//用户拥有的角色列表
  useEffect(() => {
    if (user) {
      listUserRoles({userCode: user?.code}, null, null).then(res => {
        const roles_ = {}
        if (res) {
          for (const e of res) {
            roles_[e.roleCode] = true
          }
        }
        setRoles(roles_)
      })
    }
  }, [user])
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [containSubDept, setContainSubDept] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [checkedList, setCheckedList] = useState<Key[]>([]);
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
  const selectCallback = useCallback(async (record, selected) => {
    if (user) {
      if (selected) {
        await addUserRole(user.code, record.code)
        setCheckedList([...checkedList, record.code])
        setRoles({...roles, [record.code]: true})
        message.success('添加角色成功：'+record.name)
      } else {
        await delUserRole(user.code, record.code)
        setCheckedList(checkedList.filter(e => e !== record.code))
        setRoles({...roles, [record.code]: false})
        message.success('删除角色成功：'+record.name)
      }
    }
  }, [user, checkedList, roles])
  const dataChangeCallback = useCallback((data: any[]) => {
    const checkedList_ = []
    for (const e of data) {
      if (roles[e.code]) {
        checkedList_.push(e.code)
      }
    }
    setCheckedList(checkedList_)
    console.log('checked>', JSON.stringify(checkedList_))
  }, [roles])

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
  ];

  return (
    <Modal
      width='80%'
      title={
        <div>
          用户角色设置
          <span className={styles.subTitle}>(用户: {user?.name})</span>
        </div>
      }
      footer={null}
      onCancel={onClose}
      {...otherProps}
    >
      <Layout className={styles.layout}>
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
