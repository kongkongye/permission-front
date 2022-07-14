import {ModalForm, ModalFormProps} from '@ant-design/pro-components';
import {Button, message, Tree} from 'antd';
import React, {useCallback, useEffect, useState} from 'react';
import styles from './UserDeptManage.less'
import {Key} from "antd/es/table/interface";
import {useModel} from "@@/exports";
import {queryUserDepts, setUserDepts} from "@/services/permission/api";

type Props<T = Record<string, any>> = ModalFormProps<T> & {
  user?: PerAPI.User;
  onClose?: () => void;
};

/**
 * 用户部门管理
 */
const Index: React.FC<Props<any>> = <T, >(props: Props<T>) => {
  const {
    user, onClose = () => {
    }, ...otherProps
  } = props;

  const {depts, treeData} = useModel('useDepts')
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const finishCallback = useCallback(async () => {
    if (user) {
      await setUserDepts(user.code, checkedKeys.map(e => e.toString()))
      message.success(`更新用户'${user.name}'部门成功`)
    }

    onClose()
  }, [user, checkedKeys, onClose])
  useEffect(() => {
    if (otherProps.visible && user) {
      setCheckedKeys([])
      queryUserDepts(user.code).then((res: any) => {
        setCheckedKeys(res)
      })
    }
  }, [otherProps.visible, user])

  return (
    <ModalForm
      title={
        <div>
          用户部门设置
          <span className={styles.subTitle}>(用户: {user?.name})</span>
        </div>
      }
      onFinish={finishCallback}
      modalProps={{
        onCancel: onClose
      }}
      {...otherProps}
    >
      {treeData && treeData.length > 0 && <Tree.DirectoryTree
        treeData={treeData}
        checkedKeys={checkedKeys}
        onCheck={(checkedKeys_: Key[] | { checked: Key[]; halfChecked: Key[]; }) => {
          // @ts-ignore
          setCheckedKeys(checkedKeys_.checked)
        }}
        defaultExpandAll
        checkable
        checkStrictly
        multiple
        expandAction="doubleClick"
      />}
    </ModalForm>
  );
};

export default Index;
