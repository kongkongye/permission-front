import {ProFormText, ProFormTextArea, ProDescriptions} from '@ant-design/pro-components';

type Props = {
  type?: string;
  parent?: PerAPI.PerValue;
  isEdit?: boolean;
};

const Index: React.FC<Props> = (props: Props) => {
  const {type, parent, isEdit=false} = props;

  return (
    <>
      <ProDescriptions>
        <ProDescriptions.Item label='权限类型' contentStyle={{color: type?'inherit':'grey'}}>{type??'无'}</ProDescriptions.Item>
        <ProDescriptions.Item label='父权限' contentStyle={{color: parent?'inherit':'grey'}}>{parent?.name??'无'}</ProDescriptions.Item>
      </ProDescriptions>
      <ProFormText name="id" hidden/>
      <ProFormText name="typeCode" hidden/>
      <ProFormText name="parent" hidden/>
      <ProFormText name="name" label="名称" placeholder="输入名称" width="md" />
      <ProFormText name="code" label="编码" placeholder="输入编码" width="md" disabled={isEdit} />
      <ProFormTextArea name="note" label="备注" placeholder="输入备注" />
    </>
  );
};

export default Index;
