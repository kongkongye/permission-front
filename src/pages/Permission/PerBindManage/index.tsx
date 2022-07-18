import {
  addPerBind,
  delPerBind,
  listPerBindBriefs,
  listPerTypes
} from '@/services/permission/api';
import {
  ProFormGroup,
  ProFormSelect, ProFormSwitch,
  ProFormText, ProFormTreeSelect
} from '@ant-design/pro-components';
import {Form, Layout, message, Tree} from 'antd';
import {Content} from 'antd/es/layout/layout';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from './index.less';
import usePerValueBriefs from "@/hooks/usePerValueBriefs";
import BindNodeSel from "@/pages/Permission/PerBindManage/components/BindNodeSel";
import BindBizSel from "@/pages/Permission/PerBindManage/components/BindBizSel";
import {FormInstance} from "antd/es";

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
            filter: e.filter,
          }
        }
        setPerTypes(perTypes_)
      } else {
        setPerTypes({})
      }
    })
  }, [])
  const filterTypeCode = useMemo(() => {
    if (typeCode) {
      const perType = perTypes[typeCode]
      return perType?.filter
    }
  }, [typeCode, perTypes])
  const [filterCode, setFilterCode] = useState<string>();
  const [filterContainSub, setFilterContainSub] = useState<boolean>(false);

  const [bindBizVisible, setBindBizVisible] = useState(false);
  const [bindNodeVisible, setBindNodeVisible] = useState(false);

  const {treeData} = usePerValueBriefs(typeCode, filterCode, filterContainSub)
  const {treeData: filterTreeData} = usePerValueBriefs(filterTypeCode)
  const formRef = useRef<FormInstance>(null);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [selBiz, setSelBiz] = useState<PerAPI.Biz>();
  const [selNode, setSelNode] = useState<any>();
  useEffect(() => {
    if (selNode && typeCode) {
      listPerBindBriefs({
        bizCode: selBiz?.code,
        bizCodeIsNull: !selBiz,

        bindType: selNode?.type,
        bindCode: selNode?.code,
        typeCode,
      }).then(res => {
        if (res) {
          setCheckedKeys(res.map(e => e.perCode))
        }
      })
    } else {
      setCheckedKeys([])
    }
  }, [selBiz, selNode, typeCode])
  const selBizCallback = useCallback((bizDirs?: PerAPI.BizDir[], biz?: PerAPI.Biz) => {
    setSelBiz(biz);
    setBindBizVisible(false)
    formRef.current?.setFieldsValue({
      bindBiz: `${bizDirs && bizDirs.length > 0 ? (bizDirs.map(e => e.name).join('>') + '|') : ''}${biz?.name || ''}`,
    })
  }, [])
  const selNodeCallback = useCallback((type: string, ...args: any[]) => {
    setBindNodeVisible(false)
    let bindNode = ''
    if (type === 'dept') {
      const routes = args[0]
      const dept = args[1]
      bindNode = `[部门]${routes && routes.length > 0 ? (routes.map((e: any) => e.name).join('>')) : ''}`
      setSelNode({
        type: 'dept',
        code: dept.code,
        dept,
      })
    } else if (type === 'role') {
      const routes = args[0]
      const role = args[1]
      bindNode = `[角色]${routes && routes.length > 0 ? (routes.map((e: any) => e.name).join('>') + '|') : ''}${role?.name || ''}`
      setSelNode({
        type: 'role',
        code: role.code,
        role,
      })
    } else if (type === 'user') {
      const user = args[0]
      bindNode = `[用户]${user?.name || ''}`
      setSelNode({
        type: 'user',
        code: user.code,
        user,
      })
    }
    formRef.current?.setFieldsValue({
      bindNode,
    })
  }, [])
  return (
    <Layout>
      <Content>
        <Form ref={formRef}>
          <ProFormText label='业务对象' placeholder='请选择(可选)' name='bindBiz' fieldProps={{
            readOnly: true,
            onClick: () => {
              setBindBizVisible(true)
            },
          }}/>
          <ProFormText label='绑定节点' placeholder='请选择' name='bindNode' fieldProps={{
            readOnly: true,
            onClick: () => {
              setBindNodeVisible(true)
            },
          }}/>
          <ProFormSelect label='权限类型' name='bindPerType' valueEnum={perTypes} fieldProps={{
            onSelect: setTypeCode,
            onDeselect: () => {
              setTypeCode(undefined)
            },
          }}/>
          <Form>
            <ProFormGroup>
              <ProFormTreeSelect width='md' allowClear disabled={!filterTreeData || filterTreeData.length === 0} label='过滤'
                                 request={async () => {
                                   return filterTreeData
                                 }} params={{
                filterTreeData
              }}
                                 fieldProps={{
                                   onSelect: setFilterCode,
                                   onClear: () => {
                                     setFilterCode(undefined)
                                   },
                                 }}/>
              <ProFormSwitch label="包含子" name="filterContainSub" fieldProps={{
                onChange: setFilterContainSub,
              }}/>
            </ProFormGroup>
          </Form>
        </Form>
        {typeCode && selNode && <div className={styles.header}>
          <span>权限列表</span>
        </div>}
        {typeCode && treeData && treeData.length > 0 && (
          <Tree.DirectoryTree
            checkStrictly
            checkable
            checkedKeys={checkedKeys}
            onCheck={async (checkedKeys_: any) => {
              const newChecked: string[] = checkedKeys_.checked
              const addList = newChecked.filter(x => !checkedKeys.includes(x));
              const removedList = checkedKeys.filter(x => !newChecked.includes(x));
              for (const added of addList) {
                await addPerBind(selNode.type, selNode.code, typeCode, added, selBiz?.code)
                setCheckedKeys([...checkedKeys, added])
                message.success('添加绑定成功')
              }
              for (const removed of removedList) {
                await delPerBind(selNode.type, selNode.code, typeCode, removed, selBiz?.code)
                setCheckedKeys(checkedKeys.filter(e => e !== removed))
                message.success('删除绑定成功')
              }
              if (checkedKeys_.checked) {
                setCheckedKeys(checkedKeys_.checked)
              }
            }}
            className={styles.tree}
            treeData={treeData}
            expandAction="doubleClick"
          />
        )}
        <BindBizSel visible={bindBizVisible} onSel={selBizCallback} onClose={() => setBindBizVisible(false)}/>
        <BindNodeSel visible={bindNodeVisible} onSel={selNodeCallback} onClose={() => setBindNodeVisible(false)}/>
      </Content>
    </Layout>
  );
};

export default PerManage;
