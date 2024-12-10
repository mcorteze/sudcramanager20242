import React from 'react';
import { Modal, Table } from 'antd';
import moment from 'moment';

const formatDate = (date) => moment(date).format('HH:mm:ss - DD/MM/YYYY');

const ModalMailsAlumno = ({ visible, mailsEnviados, closeModal }) => {
  const columns = [
    {
      title: 'ID Informe',
      dataIndex: 'id_informealum',
      key: 'id_informealum',
    },
    {
      title: 'ID Matrícula Eval',
      dataIndex: 'id_matricula_eval',
      key: 'id_matricula_eval',
    },
    {
      title: 'Marca Temporal',
      dataIndex: 'marca_temporal',
      key: 'marca_temporal',
      render: (marca_temporal) => formatDate(marca_temporal),
    },
    {
      title: 'Mail Enviado',
      dataIndex: 'mail_enviado',
      key: 'mail_enviado',
      render: (mail_enviado) => mail_enviado ? 'Si' : 'No',
    },
    {
      title: 'Marca Temporal Mail',
      dataIndex: 'marca_temp_mail',
      key: 'marca_temp_mail',
      render: (marca_temp_mail) => formatDate(marca_temp_mail),
    },
  ];

  return (
    <Modal
      title="Mails Enviados al Alumno"
      visible={visible}
      onCancel={closeModal}
      footer={null}
      width="80%"
      style={{ top: 20 }}
    >
      <Table 
        dataSource={mailsEnviados} 
        columns={columns} 
        rowKey="id_informealum" 
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </Modal>
  );
};

export default ModalMailsAlumno;
