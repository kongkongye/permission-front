import {ProFormText, ProFormTextArea, ProDescriptions, ProFormSwitch, ProFormGroup} from '@ant-design/pro-components';

type Props = {
  isEdit?: boolean;
};

const Index: React.FC<Props> = (props: Props) => {
  const {isEdit = false} = props;

  return (
    <>
      <ProFormGroup title='基础信息'>
        <ProFormText name="id" hidden/>
        <ProFormText name="parent" hidden/>
        <ProFormText name="name" label="名称" placeholder="输入名称" width="md" />
        <ProFormText name="code" label="编码" placeholder="输入编码" width="md" disabled={isEdit} />
        <ProFormTextArea name="note" label="备注" placeholder="输入备注" width='lg' />
      </ProFormGroup>
      <ProFormGroup title='密码信息'>
        <ProFormText name="password" label="密码" placeholder="输入密码(不为空时修改，为空时不修改)" width="md" />
      </ProFormGroup>
    </>
  );
};

export default Index;
