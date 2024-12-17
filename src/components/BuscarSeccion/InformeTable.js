// InformeTable.js
import React from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { LinkOutlined } from '@ant-design/icons';

const InformeTable = ({ data, loading }) => (
  <Table
    className='buscar-seccion-table1'
    dataSource={data}
    columns={[
      { title: 'ID Informe', dataIndex: 'id_informeseccion', key: 'id_informeseccion' },
      { title: 'ID Evaluación', dataIndex: 'id_eval', key: 'id_eval' },
      { title: 'Prueba', dataIndex: 'nombre_prueba', key: 'nombre_prueba' },
      {
        title: 'Mail Enviado',
        dataIndex: 'mail_enviado',
        key: 'mail_enviado',
        render: (mailEnviado) => (mailEnviado ? 'Sí' : 'No'),
      },
      {
        title: 'Fecha Envío',
        dataIndex: 'marca_temp_mail',
        key: 'marca_temp_mail',
        render: (marca_temp_mail) =>
          marca_temp_mail ? moment(marca_temp_mail).format('DD-MM-YYY, HH:mm:ss') : 'N/A',
      },
      {
        title: 'Link Informe',
        dataIndex: 'link_informe',
        key: 'link_informe',
        render: (link) => (
          <a href={link} target="_blank" rel="noopener noreferrer">
            <LinkOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
          </a>
        ),
      },
    ]}
    rowKey="id_informeseccion"
    loading={loading}
    pagination={false}
  />
);

export default InformeTable;
