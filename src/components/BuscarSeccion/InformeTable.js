import React from 'react';
import { Table, Tooltip, message, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { LinkOutlined, SendOutlined } from '@ant-design/icons';

const { confirm } = Modal;

// Función para reenviar el informe de una sección
const handleReenviarInformeSeccion = (id_informeseccion, nombre_prueba) => {
  confirm({
    title: '¿Estás seguro de reenviar el informe de la sección?',
    content: `Esta acción reenviará el informe de la sección para la prueba: ${nombre_prueba}.`,
    okText: 'Sí, reenviar',
    cancelText: 'Cancelar',
    onOk: async () => {
      try {
        await axios.put('http://localhost:3001/api/reenviar-informe-seccion', {
          idInformeSeccion: id_informeseccion,
        });
        message.success('Informe de sección reenviado con éxito');
      } catch (error) {
        console.error('Error al reenviar el informe de la sección:', error);
        message.error('Error al reenviar el informe de la sección');
      }
    },
    onCancel: () => {
      message.info('Operación cancelada');
    },
  });
};

const InformeTable = ({ data, loading }) => (
  <Table
    className="buscar-seccion-table1"
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
      {
        title: 'Reenviar Informe',
        key: 'acciones',
        render: (_, record) => (
          <Tooltip title="Reenviar Informe">
            <SendOutlined
              style={{ fontSize: '18px', color: '#52c41a', cursor: 'pointer' }}
              onClick={() => handleReenviarInformeSeccion(record.id_informeseccion, record.nombre_prueba)}
            />
          </Tooltip>
        ),
      },
    ]}
    rowKey="id_informeseccion"
    loading={loading}
    pagination={false}
  />
);

export default InformeTable;
