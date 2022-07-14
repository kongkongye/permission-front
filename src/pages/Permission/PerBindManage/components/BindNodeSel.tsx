import {
  ModalFormProps
} from '@ant-design/pro-components';
import {Modal, Tabs} from 'antd';
import React from 'react';
import BindNodeSelDept from "@/pages/Permission/PerBindManage/components/BindNodeSelDept";
import BindNodeSelRole from "@/pages/Permission/PerBindManage/components/BindNodeSelRole";
import BindNodeSelUser from "@/pages/Permission/PerBindManage/components/BindNodeSelUser";

type Props<T = Record<string, any>> = ModalFormProps<T> & {
  visible: boolean;
  onSel: (type: string, ...args: any[]) => void;
  onClose: () => void;
};

const Index: React.FC<Props<any>> = <T, >(props: Props<T>) => {
  const {
    visible, onSel, onClose
  } = props;

  return (
    <Modal
      visible={visible}
      width='80%'
      title='选择绑定节点'
      footer={null}
      onCancel={onClose}
    >
      <Tabs centered>
        <Tabs.TabPane tab='部门' key='1'>
          <BindNodeSelDept onSel={(routes, dept) => onSel('dept', routes, dept)}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab='角色' key='2'>
          <BindNodeSelRole onSel={(routes, role) => onSel('role', routes, role)}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab='用户' key='3'>
          <BindNodeSelUser onSel={(user) => onSel('user', user)}/>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default Index;
