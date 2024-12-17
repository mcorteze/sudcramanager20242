import React from 'react';
import { Table } from 'antd';

const LecturaTable = ({ lecturaData, loading }) => {
  const lecturaColumns = [
    { title: 'ID Lectura', dataIndex: 'id_lectura', key: 'id_lectura' },
    { title: 'Imagen', dataIndex: 'imagen', key: 'imagen' },
    { title: 'Instante Forms', dataIndex: 'instante_forms', key: 'instante_forms' },
    { title: 'RUT', dataIndex: 'rut', key: 'rut' },
    { title: 'ID_MATRICULA_EVAL', dataIndex: 'id_matricula_eval', key: 'id_matricula_eval' },
    { title: 'LOGRO OBTENIDO', dataIndex: 'logro_obtenido', key: 'logro_obtenido' },
    { title: 'Num Prueba', dataIndex: 'num_prueba', key: 'num_prueba' },
    { title: 'Reproceso', dataIndex: 'reproceso', key: 'reproceso', render: (text) => text ? 'Sí' : 'No' },
  ];

  return (
    <div>
      <h2>Imágenes con calificación</h2>
      <Table
        columns={lecturaColumns}
        dataSource={lecturaData}
        loading={loading}
        rowKey="id_lectura"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default LecturaTable;