import EditForm from '@/components/EditForm';
import DeptForm from '@/pages/Permission/DeptManage/components/DeptForm';
import {saveDept, delDept} from '@/services/permission/api';
import { DeleteOutlined } from '@ant-design/icons';
import { ProFormInstance } from '@ant-design/pro-components';
import { Button, Layout, message, Popconfirm, Tree } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Key } from 'antd/es/table/interface';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import styles from './index.less';
import {useModel} from "@umijs/max";

const DeptManage: React.FC = () => {
  const {depts, treeData, refresh} = useModel('useDepts')
  const newFormRef = useRef<ProFormInstance>();
  const editFormRef = useRef<ProFormInstance>();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const sel = useMemo(() => depts[selectedKeys[0]], [depts, selectedKeys])
  const newVisibleChangeCallback = useCallback(
    (visible) => {
      if (visible) {
        newFormRef.current?.setFieldsValue({
          parent: sel?.code,
        });
      }
    },
    [sel],
  );
  const editVisibleChangeCallback = useCallback(
    (visible) => {
      if (visible) {
        editFormRef.current?.setFieldsValue({ ...sel });
      }
    },
    [sel],
  );
  const delCallback = useCallback(async () => {
    await delDept(sel.id);
    refresh();
    message.success('删除成功！');
  }, [sel, refresh]);
  return (
    <Layout>
      <Content>
        <div className={styles.header}>
          <span>部门列表</span>
          <div className={styles.toolbar}>
            <EditForm
              formRef={newFormRef}
              title="部门"
              isEdit={false}
              onVisibleChange={newVisibleChangeCallback}
              onFinish={async (formData) => {
                await saveDept(formData);
                refresh();
                message.success('添加成功！');
                return true;
              }}
            >
              <DeptForm parent={sel} />
            </EditForm>
            <EditForm
              formRef={editFormRef}
              title="部门"
              id={sel?.code}
              idLabel="编码"
              isEdit={true}
              onVisibleChange={editVisibleChangeCallback}
              onFinish={async (formData) => {
                await saveDept(formData);
                refresh();
                message.success('更新成功！');
                return true;
              }}
            >
              <DeptForm parent={sel && sel.parent ? depts[sel.parent] : null} isEdit />
            </EditForm>
            <Popconfirm
              disabled={!sel}
              placement="left"
              title={`确认删除部门'${sel?.name}'吗？`}
              onConfirm={delCallback}
            >
              <Button
                disabled={!sel}
                icon={<DeleteOutlined />}
                type="default"
                shape="round"
                size="small"
                style={{ marginRight: '5px' }}
              >
                删除
              </Button>
            </Popconfirm>
          </div>
        </div>
        {treeData && treeData.length > 0 && (
          <Tree.DirectoryTree
            selectedKeys={selectedKeys}
            className={styles.tree}
            treeData={treeData}
            onSelect={setSelectedKeys}
            defaultExpandAll
            expandAction="doubleClick"
          />
        )}
      </Content>
    </Layout>
  );
};

export default DeptManage;
