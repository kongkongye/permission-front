import EditForm from '@/components/EditForm';
import { ProFormInstance } from '@ant-design/pro-components';
import { Layout, message, Tree } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Key } from 'antd/es/table/interface';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import styles from './index.less';
import {useModel} from "@umijs/max";
import BizDirForm from "@/pages/Permission/BizDirManage/components/BizDirForm";
import {saveBizDir} from "@/services/permission/api";

const BizDirManage: React.FC = () => {
  const {codes, treeData, refresh} = useModel('useBizDirs')
  const newFormRef = useRef<ProFormInstance>();
  const editFormRef = useRef<ProFormInstance>();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const sel = useMemo(() => codes[selectedKeys[0]], [codes, selectedKeys])
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
  return (
    <Layout>
      <Content>
        <div className={styles.header}>
          <span>业务对象目录列表</span>
          <div className={styles.toolbar}>
            <EditForm
              formRef={newFormRef}
              title="业务对象目录"
              isEdit={false}
              onVisibleChange={newVisibleChangeCallback}
              onFinish={async (formData) => {
                await saveBizDir(formData);
                refresh();
                message.success('添加成功！');
                return true;
              }}
            >
              <BizDirForm parent={sel} />
            </EditForm>
            <EditForm
              formRef={editFormRef}
              title="业务对象目录"
              id={sel?.code}
              idLabel="编码"
              isEdit={true}
              onVisibleChange={editVisibleChangeCallback}
              onFinish={async (formData) => {
                await saveBizDir(formData);
                refresh();
                message.success('更新成功！');
                return true;
              }}
            >
              <BizDirForm parent={sel && sel.parent ? codes[sel.parent] : null} isEdit />
            </EditForm>
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

export default BizDirManage;
