import React from 'react';
import { Table } from 'antd';

const ImagenesTable = ({ imagenesData, loading }) => {
  const imagenesColumns = [
    { title: 'ID Sección', dataIndex: 'id_seccion', key: 'id_seccion' },
    { title: 'ID Lista', dataIndex: 'id_lista', key: 'id_lista' },
    { title: 'ID Imagen', dataIndex: 'id_imagen', key: 'id_imagen' },
    { title: 'Imagen', dataIndex: 'imagen', key: 'imagen' },
    { 
      title: 'URL Imagen', 
      dataIndex: 'url_imagen', 
      key: 'url_imagen',
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          {text}
        </a>
      ),
    },
  ];

  return (
    <div>
      <h2>Registros en tabla Imágenes</h2>
      <Table
        columns={imagenesColumns}
        dataSource={imagenesData}
        loading={loading}
        rowKey="id_imagen"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ImagenesTable;