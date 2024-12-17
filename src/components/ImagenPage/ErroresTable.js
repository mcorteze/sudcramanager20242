import React from 'react';
import { Table } from 'antd';

const ErroresTable = ({ erroresData, loading }) => {
  const erroresColumns = [
    { title: 'ID Error', dataIndex: 'id_error', key: 'id_error' },
    { title: 'ID Archivo Leído', dataIndex: 'id_archivoleido', key: 'id_archivoleido' },
    { title: 'RUT', dataIndex: 'rut', key: 'rut' },
    { title: 'Imagen', dataIndex: 'imagen', key: 'imagen' },
    { title: 'Valida RUT', dataIndex: 'valida_rut', key: 'valida_rut', render: (text) => text ? 'Sí' : 'No' },
    { title: 'Valida Matrícula', dataIndex: 'valida_matricula', key: 'valida_matricula', render: (text) => text ? 'Sí' : 'No' },
    { title: 'Valida Inscripción', dataIndex: 'valida_inscripcion', key: 'valida_inscripcion', render: (text) => text ? 'Sí' : 'No' },
    { title: 'Valida Eval', dataIndex: 'valida_eval', key: 'valida_eval', render: (text) => text ? 'Sí' : 'No' },
    { title: 'Valida Forma', dataIndex: 'valida_forma', key: 'valida_forma', render: (text) => text ? 'Sí' : 'No' },
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
