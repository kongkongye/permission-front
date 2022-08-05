import {useListPertypes} from '@/services/permission/api';
import {useEffect, useState} from 'react';
import {useModel} from "@umijs/max";

const usePerTypes = () => {
  const [perTypes, setPerTypes] = useState<{ [key: string]: any }>({});
  const {initialState} = useModel('@@initialState');
  const {data, refresh} = useListPertypes(!!initialState?.currentUser);
  useEffect(() => {
    if (data) {
      //perTypes
      const perType_ = {};
      for (const e of data) {
        perType_[e.code] = e;
      }
      setPerTypes(perType_);
    }
  }, [data]);

  return {perTypes, refresh};
};

export default usePerTypes;
