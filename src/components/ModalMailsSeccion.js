import React from 'react';
import { Modal, Button, Table } from 'antd';
import moment from 'moment'; // Importa moment.js para formatear la fecha si es necesario

export default function ModalMailsSeccion ({ visible, mailsEnviados, closeModal }) {
  const tableColumns = [
    { title: 'ID Informe Sección', dataIndex: 'id_informeseccion', key: 'id_informeseccion' },
    { title: 'ID Sección', dataIndex: 'id_seccion', key: 'id_seccion' },
    { title: 'ID Evaluación', dataIndex: 'id_eval', key: 'id_eval' },
    { 
      title: 'Marca Temporal', 
      dataIndex: 'marca_temporal', 
      key: 'marca_temporal', 
      render: (marca_temporal) => moment(marca_temporal).format('HH:mm:ss - YYYY-MM-DD'), // Formato de fecha deseado para "Marca Temporal"
    },
    { 
      title: 'Mails Enviado', 
      dataIndex: 'mail_enviado', 
      key: 'mail_enviado', 
      render: (mail_enviado) => mail_enviado ? 'Si' : 'No', // Transforma el booleano a texto
    },
    { 
      title: 'Marca Temporal Mail', 
      dataIndex: 'marca_temp_mail', 
      key: 'marca_temp_mail', 
      render: (marca_temp_mail) => moment(marca_temp_mail).format('HH:mm:ss - YYYY-MM-DD'), // Formato de fecha deseado para "Marca Temporal Mail"
    },
  ];

  return (
    <Modal
      title="Mails enviados a la sección"
      visible={visible}
      onCancel={closeModal}
      footer={[
        <Button key="close" onClick={closeModal}>
          Cerrar
        </Button>,
      ]}
      width="80%" // Ajusta el ancho del modal según sea necesario
      style={{ top: 20 }} // Ajusta la posición del modal si es necesario
    >
      <Table
        dataSource={mailsEnviados}
        columns={tableColumns}
        rowKey="id_informeseccion"
        pagination={false} // Deshabilitar paginación si no es necesaria
        scroll={{ x: 'max-content' }} // Permitir scroll horizontal si es necesario
      />
    </Modal>
  );
}
