import React from 'react';
import { Table } from 'antd';

const SedesSummaryTable = ({ data }) => {
  const columns = [
    { title: 'Sede', dataIndex: 'nombre_sede', key: 'nombre_sede' },
    { title: 'Cantidad de Procesamientos', dataIndex: 'cantidad', key: 'cantidad' },
    { title: 'Programas', dataIndex: 'programa', key: 'programa' },
  ];

  return <Table dataSource={data} columns={columns} rowKey="id_sede" />;
};

export default SedesSummaryTable;
