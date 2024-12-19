import React from 'react';
import { Table } from 'antd';

const LecturaTempTable = ({ lecturaTempData, loading }) => {
  const lecturaTempColumns = [
    { title: 'ID Lectura', dataIndex: 'id_lectura', key: 'id_lectura' },
    { title: 'RUT', dataIndex: 'rut', key: 'rut' },
    { title: 'ID Archivo Leído', dataIndex: 'id_archivoleido', key: 'id_archivoleido' },
    { title: 'Imagen', dataIndex: 'imagen', key: 'imagen' },
    { title: 'Instante Forms', dataIndex: 'instante_forms', key: 'instante_forms' },
  ];

  return (
    <div>
      <h2>Registros en tabla Lectura Temporal</h2>
      <Table
        className='buscar-seccion-table1'
        columns={lecturaTempColumns}
        dataSource={lecturaTempData}
        loading={loading}
        rowKey="id_lectura"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default LecturaTempTable;
