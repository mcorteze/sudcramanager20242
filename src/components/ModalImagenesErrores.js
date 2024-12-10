import React from 'react';
import { Modal, Table } from 'antd';

const ModalImagenesErrores = ({ visible, data, closeModal }) => {
  const columns = [
    {
      title: 'ID Imagen',
      dataIndex: 'id_imagen',
      key: 'id_imagen',
    },
    {
      title: 'Nombre Imagen',
      dataIndex: 'nombre_imagen',
      key: 'nombre_imagen',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
  ];

  return (
    <Modal
      title="Imágenes con Errores"
      visible={visible}
      onCancel={closeModal}
      footer={null}
      width={800}
    >
      <Table dataSource={data} columns={columns} rowKey="id_imagen" pagination={false} />
    </Modal>
  );
};

export default ModalImagenesErrores;
