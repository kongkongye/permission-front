import {
  listPerTypes,
  listUserPerBindBriefs
} from '@/services/permission/api';
import {
  ProFormGroup,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Form, Layout, message, Tree } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.less';
import usePerValueBriefs from '@/hooks/usePerValueBriefs';
import BindBizSel from '@/pages/Permission/UserPerManage/components/BindBizSel';
import { FormInstance } from 'antd/es';
import BindNodeSelUser from "@/pages/Permission/UserPerManage/components/BindNodeSelUser";

const UserPerManage: React.FC = () => {
  const [perTypes, setPerTypes] = useState({});
  const [typeCode, setTypeCode] = useState<string>();
  const [selBiz, setSelBiz] = useState<PerAPI.Biz>();
  const [selUser, setSelUser] = useState<PerAPI.User>();
  const formRef = useRef<FormInstance>(null);
  useEffect(() => {
    //setTypeCode(undefined)
    formRef.current?.setFieldsValue({
      bindPerType: undefined,
    });
    listPerTypes({
      bizCode: selBiz?.code,
    }).then((res) => {
      if (res) {
        const perTypes_ = {};
        for (const e of res) {
          perTypes_[e.code] = {
            text: e.name,
            filter: e.filter,
          };
        }
        setPerTypes(perTypes_);
      } else {
        setPerTypes({});
      }
    });
  }, [selBiz]);
  const filterTypeCode = useMemo(() => {
    if (typeCode) {
      const perType = perTypes[typeCode];
      return perType?.filter;
    }
  }, [typeCode, perTypes]);
  const [filterCode, setFilterCode] = useState<string>();
  const [filterContainSub, setFilterContainSub] = useState<boolean>(false);
  const filterCodeFormRef = useRef<FormInstance>(null);

  const [bindBizVisible, setBindBizVisible] = useState(false);
  const [bindUserVisible, setBindUserVisible] = useState(false);
  const { treeData } = usePerValueBriefs(typeCode, filterCode, filterContainSub);
  const { treeData: filterTreeData } = usePerValueBriefs(filterTypeCode);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  useEffect(() =>{
    if(selUser){
      listUserPerBindBriefs({
        bizCode: selBiz?.code,
        bizCodeIsNull: !selBiz,
        bindType: 'user',
        bindCode: selUser?.code,
        typeCode,
      }).then((res: any) =>{
        if(res){
          setCheckedKeys(res);
        }
      });
    } else {
      setCheckedKeys([]);
    }
  }, [selBiz,selUser,typeCode])
  //when typeCode changed, clear filterCode
  useEffect(() => {
    filterCodeFormRef.current?.setFieldsValue({
      filterCode: undefined,
    });
    setFilterCode(undefined);
  }, [typeCode]);
  const selBizCallback = useCallback((bizDirs?: PerAPI.BizDir[], biz?: PerAPI.Biz) => {
    setSelBiz(biz);
    setBindBizVisible(false);
    formRef.current?.setFieldsValue({
      bindBiz: `${bizDirs && bizDirs.length > 0 ? bizDirs.map((e) => e.name).join('>') + '|' : ''}${
        biz?.name || ''
      }`,
    });
  }, []);
  const selUserCallback = useCallback((user?: PerAPI.User) => {
    setSelUser(user);
    setBindUserVisible(false);
    formRef.current?.setFieldsValue({
      bindUser: user?.name,
    });
  }, []);
  return (
    <Layout>
      <Content>
        <Form ref={formRef}>
          <ProFormText
            label="业务对象"
            placeholder="请选择(可选)"
            name="bindBiz"
            fieldProps={{
              readOnly: true,
              onClick: () => {
                setBindBizVisible(true);
              },
            }}
          />
          <ProFormText
            label="选择用户"
            placeholder="请选择"
            name="bindUser"
            fieldProps={{
              readOnly: true,
              onClick: () => {
                setBindUserVisible(true);
              },
            }}
          />
          <ProFormSelect
            label="权限类型"
            name="bindPerType"
            valueEnum={perTypes}
            fieldProps={{
              onSelect: setTypeCode,
              onDeselect: () => {
                setTypeCode(undefined);
              },
            }}
          />
          <Form ref={filterCodeFormRef}>
            <ProFormGroup>
              <ProFormTreeSelect
                name='filterCode'
                width="md"
                allowClear
                disabled={!filterTreeData || filterTreeData.length === 0}
                label="过滤"
                request={async () => {
                  return filterTreeData;
                }}
                params={{
                  filterTreeData,
                }}
                fieldProps={{
                  onSelect: setFilterCode,
                  onClear: () => {
                    setFilterCode(undefined);
                  },
                }}
              />
              <ProFormSwitch
                label="包含子"
                name="filterContainSub"
                fieldProps={{
                  onChange: setFilterContainSub,
                }}
              />
            </ProFormGroup>
          </Form>
        </Form>
        {typeCode && (
          <div className={styles.header}>
            <span>权限列表</span>
          </div>
        )}
        {typeCode && treeData && treeData.length > 0 && (
          <Tree.DirectoryTree
            checkStrictly
            checkable
            disabled
            checkedKeys={checkedKeys}
            className={styles.tree}
            treeData={treeData}
            expandAction="doubleClick"
          />
        )}
        <BindBizSel
          visible={bindBizVisible}
          onSel={selBizCallback}
          onClose={() => setBindBizVisible(false)}
        />
        <BindNodeSelUser
          visible={bindUserVisible}
          onSel={selUserCallback}
          onClose={() => setBindUserVisible(false)}
        />
      </Content>
    </Layout>
  );
};

export default UserPerManage;
