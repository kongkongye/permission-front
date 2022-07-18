import { Button, message } from 'antd';
import React from 'react';
import { usePost } from '@/hooks/useReq';

const SystemManage: React.FC = () => {
  const { loading, run } = usePost(
    '/admin/system/refreshCache',
    {},
    {
      manual: true,
      debounceWait: 300,
    },
  );

  return (
    <div>
      <Button
        disabled={loading}
        onClick={async () => {
          await run();
          message.success('刷新成功');
        }}
      >
        刷新权限缓存
      </Button>
    </div>
  );
};

export default SystemManage;
