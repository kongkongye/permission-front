import {ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import React, {useEffect, useState} from "react";
import {listPerTypes, useListPertypes} from "@/services/permission/api";
import {useModel} from "@@/exports";

type Props = {
  parent?: PerAPI.PerType;
  isEdit?: boolean;
};

const Index: React.FC<Props> = (props: Props) => {
  const {parent, isEdit=false} = props;
  const [filterData, setFilterData] = useState({});
  useEffect(() => {
    listPerTypes({}).then(res => {
      if (res) {
        const filter_ = {}
        for (const e of res) {
          filter_[e.code] = {
            text: e.name,
            filter: e.filter,
          }
        }
        setFilterData(filter_)
      } else {
        setFilterData({})
      }
    })
  }, [])

  return (
    <>
      <ProFormText name="id" hidden/>
      <ProFormText name="name" label="名称" placeholder="输入名称" width="md" />
      <ProFormText name="code" label="编码" placeholder="输入编码" width="md" disabled={isEdit} />
      <ProFormTextArea name="note" label="备注" placeholder="输入备注" />
      <ProFormSelect name="filter" label="筛选" valueEnum={filterData} width="md" />
    </>
  );
};

export default Index;
