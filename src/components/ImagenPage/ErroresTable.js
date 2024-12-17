import React from 'react';
import { Table } from 'antd';

const ErroresTable = ({ erroresData, loading }) => {
  const erroresColumns = [
    { title: 'ID Error', dataIndex: 'id_error', key: 'id_error' },
    { title: 'RUT', dataIndex: 'rut', key: 'rut' },
    { title: 'Num Prueba', dataIndex: 'num_prueba', key: 'num_prueba' },
    { title: 'Cod Interno', dataIndex: 'cod_interno', key: 'cod_interno' },
    { title: 'ID Archivo Leído', dataIndex: 'id_archivoleido', key: 'id_archivoleido' },
    { title: 'Imagen', dataIndex: 'imagen', key: 'imagen' },
    { title: 'Instante Forms', dataIndex: 'instante_forms', key: 'instante_forms' },
    { title: 'Valida RUT', dataIndex: 'valida_rut', key: 'valida_rut', render: (text) => text ? 'Sí' : 'No' },
  ];

  return (
    <div>
      <h2>Registros en tabla Errores</h2>
      <Table
        columns={erroresColumns}
        dataSource={erroresData}
        loading={loading}
        rowKey="id_error"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ErroresTable;
