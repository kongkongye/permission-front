import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm, ModalFormProps } from '@ant-design/pro-components';
import { Button } from 'antd';
import React from 'react';
import styles from './index.less'

type Props<T = Record<string, any>> = ModalFormProps<T> & {
  title: string;
  id?: any;
  idLabel?: string;
  isEdit: boolean;
  noTrigger?: boolean;
};

const Index: React.FC<Props<any>> = <T,>(props: Props<T>) => {
  const { title, id, idLabel = 'ID', isEdit, noTrigger=false, children, ...otherProps } = props;

  return (
    <ModalForm
      title={
        <div>
          {isEdit ? '编辑' : '新建'}
          {title}
          {isEdit && <span className={styles.subTitle}>({idLabel}: {id})</span>}
        </div>
      }
      autoFocusFirstInput
      trigger={
        noTrigger?undefined:<Button
          disabled={isEdit && !id}
          icon={isEdit ? <EditOutlined /> : <PlusOutlined />}
          type={isEdit ? 'default' : 'primary'}
          shape="round"
          size="small"
          style={{ marginRight: '5px' }}
        >
          {isEdit ? '编辑' : '新建'}
        </Button>
      }
      {...otherProps}
    >
      {children}
    </ModalForm>
  );
};

export default Index;
