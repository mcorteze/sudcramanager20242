import React from 'react';
import { Table } from 'antd';

const LastProcessingTable = ({ data }) => {
  const columns = [
    { title: 'Logro Obtenido', dataIndex: 'logro_obtenido', key: 'logro_obtenido' },
    { title: 'Fecha Lectura', dataIndex: 'lectura_fecha', key: 'lectura_fecha' },
    { title: 'Número de Prueba', dataIndex: 'num_prueba', key: 'num_prueba' },
    { title: 'Sede', dataIndex: 'nombre_sede', key: 'nombre_sede' },
    { title: 'Asignatura', dataIndex: 'cod_asig', key: 'cod_asig' },
  ];

  return <Table dataSource={data} columns={columns} rowKey="id_informealum" />;
};

export default LastProcessingTable;
