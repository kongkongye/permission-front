import EditForm from '@/components/EditForm';
import {getPerValue, listPerTypes, savePerValue} from '@/services/permission/api';
import {ProFormInstance, ProFormSelect} from '@ant-design/pro-components';
import {Button, Layout, message, Tree} from 'antd';
import {Content} from 'antd/es/layout/layout';
import {Key} from 'antd/es/table/interface';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from './index.less';
import usePerValueBriefs from "@/hooks/usePerValueBriefs";
import PerValueForm from "@/pages/Permission/PerManage/components/PerValueForm";

const PerManage: React.FC = () => {
  const [perTypes, setPerTypes] = useState({});
  const [typeCode, setTypeCode] = useState<string>();
  useEffect(() => {
    listPerTypes({}).then(res => {
      if (res) {
        const perTypes_ = {}
        for (const e of res) {
          perTypes_[e.code] = {
            text: e.name,
          }
        }
        setPerTypes(perTypes_)
      } else {
        setPerTypes({})
      }
    })
  }, [])

  const {codes, treeData, refresh} = usePerValueBriefs(typeCode)
  const newFormRef = useRef<ProFormInstance>();
  const editFormRef = useRef<ProFormInstance>();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const sel = useMemo(() => codes[selectedKeys[0]], [codes, selectedKeys])
  const newVisibleChangeCallback = useCallback(
    (visible) => {
      if (visible) {
        newFormRef.current?.setFieldsValue({
          parent: sel?.code,
          typeCode,
        });
      }
    },
    [sel, typeCode],
  );
  const editVisibleChangeCallback = useCallback(
    (visible) => {
      if (visible) {
        getPerValue({typeCode, code: sel?.code}).then(res => {
          editFormRef.current?.setFieldsValue({...res});
        })
      }
    },
    [typeCode, sel],
  );
  return (
    <Layout>
      <Content>
        <ProFormSelect label='权限类型' valueEnum={perTypes} fieldProps={{
          onSelect: setTypeCode,
          onDeselect: () => {
            setTypeCode(undefined)
          },
        }}/>
        {typeCode && <div className={styles.header}>
          <span>权限列表</span>
          <div className={styles.toolbar}>
            <Button type='link' disabled={!selectedKeys || selectedKeys.length === 0} style={{marginRight: '5px'}} onClick={() => {
              setSelectedKeys([])}
            }>取消选择</Button>
            <EditForm
              formRef={newFormRef}
              title="权限"
              isEdit={false}
              onVisibleChange={newVisibleChangeCallback}
              onFinish={async (formData) => {
                await savePerValue(formData);
                refresh();
                message.success('添加成功！');
                return true;
              }}
            >
              <PerValueForm type={typeCode?perTypes[typeCode].text:null} parent={sel}/>
            </EditForm>
            <EditForm
              formRef={editFormRef}
              title="权限"
              id={sel?.code}
              idLabel="编码"
              isEdit={true}
              onVisibleChange={editVisibleChangeCallback}
              onFinish={async (formData) => {
                await savePerValue(formData);
                refresh();
                message.success('更新成功！');
                return true;
              }}
            >
              <PerValueForm type={typeCode?perTypes[typeCode].text:null} parent={sel && sel.parent ? codes[sel.parent] : null} isEdit/>
            </EditForm>
          </div>
        </div>}
        {treeData && treeData.length > 0 && (
          <Tree.DirectoryTree
            selectedKeys={selectedKeys}
            className={styles.tree}
            treeData={treeData}
            onSelect={setSelectedKeys}
            expandAction="doubleClick"
          />
        )}
      </Content>
    </Layout>
  );
};

export default PerManage;
