// DocenteTable.js
import React from 'react';
import { Table, Button } from 'antd';

const DocenteTable = ({ data, loading, onDelete }) => (
  <Table
    dataSource={data}
    className='buscar-seccion-table1'
    columns={[
      { title: 'ID Sección', dataIndex: 'id_seccion', key: 'id_seccion' },
      { title: 'RUT Docente', dataIndex: 'rut_docente', key: 'rut_docente' },
      { title: 'Apellido', dataIndex: 'apellidos_doc', key: 'apellidos_doc' },
      { title: 'Nombre', dataIndex: 'nombre_doc', key: 'nombre_doc' },
      { title: 'Email', dataIndex: 'mail_doc', key: 'mail_doc' },
      {
        title: 'Acciones',
        key: 'acciones',
        render: (text, record) => (
          <Button type="danger" onClick={() => onDelete(record.id_seccion, record.rut_docente)}>
            Eliminar
          </Button>
        ),
      },
    ]}
    rowKey="rut_docente"
    loading={loading}
    pagination={false}
  />
);

export default DocenteTable;
