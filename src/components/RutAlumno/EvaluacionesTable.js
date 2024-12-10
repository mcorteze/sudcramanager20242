import React from 'react';
import { Table, Typography } from 'antd';
import moment from 'moment';

const columns = [
  { title: 'ID Sección', dataIndex: 'id_seccion', key: 'id_seccion' },
  { title: 'Sección', dataIndex: 'seccion', key: 'seccion' },
  { title: 'Asignatura', dataIndex: 'asig', key: 'asig' },
  { title: 'RUT Docente', dataIndex: 'rut_docente', key: 'rut_docente' },
  { title: 'Nombre Docente', dataIndex: 'nombre_doc', key: 'nombre_doc' },
  { title: 'Apellidos Docente', dataIndex: 'apellidos_doc', key: 'apellidos_doc' },
  {
    title: 'Lectura Fecha',
    dataIndex: 'lectura_fecha',
    key: 'lectura_fecha',
    render: (text) => moment(text).format('HH:mm:ss - DD/MM/YYYY'),
  },
  { title: 'Número de Prueba', dataIndex: 'num_prueba', key: 'num_prueba' },
  {
    title: 'Informe Listo',
    dataIndex: 'informe_listo',
    key: 'informe_listo',
    render: (informe_listo) => (
      <span style={{ color: informe_listo ? 'rgb(99, 173, 247)' : 'grey' }}>
        {informe_listo ? 'Listo' : 'No listo'}
      </span>
    ),
  },
];

const EvaluacionesTable = ({ alumnos }) => {
  if (alumnos.length === 0) return null;

  return (
    <div style={{ margin: '20px 0px' }}>
      <Typography.Title level={4}>Evaluaciones procesadas</Typography.Title>
      <Table
        className="formato-table1"
        columns={columns}
        dataSource={alumnos}
        rowKey="id_calificacion"
        pagination={false}
      />
    </div>
  );
};

export default EvaluacionesTable;
