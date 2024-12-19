import React, { useState } from 'react';
import { Table, Modal, Button, notification } from 'antd';
import { CopyOutlined, DownloadOutlined, EyeOutlined, ArrowsAltOutlined } from '@ant-design/icons'; // Importando los íconos

const ImagenesTable = ({ imagenesData, loading }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMaxHeightFull, setIsMaxHeightFull] = useState(false); // Estado para alternar el tamaño de la imagen

  // Mostrar modal para visualizar la imagen
  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalVisible(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Ir a la imagen anterior
  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Ir a la siguiente imagen
  const nextImage = () => {
    if (currentImageIndex < imagenesData.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Función para copiar la URL al portapapeles
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        notification.success({
          message: 'URL Copiada',
          description: 'La URL de la imagen ha sido copiada al portapapeles.',
        });
      })
      .catch(() => {
        notification.error({
          message: 'Error al copiar',
          description: 'Hubo un error al intentar copiar la URL.',
        });
      });
  };

  // Función para descargar la imagen
  const downloadImage = (url) => {
    const downloadUrl = `https://duoccl0.sharepoint.com/sites/SUDCRA2/_layouts/15/download.aspx?SourceUrl=${encodeURIComponent(url)}`;

    // Abrir la URL de descarga en una nueva pestaña
    window.open(downloadUrl, '_blank');

  };

  // Alternar el tamaño de la imagen entre '80vh' y '100%'
  const toggleImageSize = () => {
    setIsMaxHeightFull((prev) => !prev);
  };

  const imagenesColumns = [
    { title: 'ID Sección', dataIndex: 'id_seccion', key: 'id_seccion' },
    { title: 'ID Lista', dataIndex: 'id_lista', key: 'id_lista' },
    { title: 'ID Imagen', dataIndex: 'id_imagen', key: 'id_imagen' },
    { title: 'Imagen', dataIndex: 'imagen', key: 'imagen' },
    { 
      title: 'Acciones', 
      key: 'acciones',
      render: (_, __, index) => (
        <div>
          {/* Botón de copiar URL */}
          <Button 
            type="link" 
            icon={<CopyOutlined />} 
            onClick={() => copyToClipboard(imagenesData[index].url_imagen)} 
          >
            Copiar URL
          </Button>
          
          {/* Botón de descarga */}
          <Button 
            type="link" 
            icon={<DownloadOutlined />} 
            onClick={() => downloadImage(imagenesData[index].url_imagen)} 
          >
            Descargar
          </Button>

          {/* Botón para ver la imagen */}
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => openModal(index)}
          >
            Ver Imagen
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Registros en tabla Imágenes</h2>
      <Table
        className='buscar-seccion-table1'
        columns={imagenesColumns}
        dataSource={imagenesData}
        loading={loading}
        rowKey="id_imagen"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal para el visor de imágenes */}
      <Modal
        visible={isModalVisible}
        title={`Visor de Imagen: ${imagenesData[currentImageIndex]?.imagen || 'Sin nombre'}`}
        footer={null}
        onCancel={closeModal}
        centered
        width="90%" // Ocupa el 90% del ancho de la pantalla
        style={{ top: 0 }} // Espaciado superior reducido
      >
        <div style={{ position: 'relative', textAlign: 'center' }}>
          {/* Imagen */}
          <img
            src={imagenesData[currentImageIndex]?.url_imagen}
            alt={imagenesData[currentImageIndex]?.imagen}
            style={{ maxWidth: '100%', maxHeight: isMaxHeightFull ? '100%' : '80vh' }} // Cambia el tamaño según el estado
          />
        </div>

        {/* Nombre de la imagen flotante */}
        <div
          style={{
            position: 'fixed',
            bottom: 80, // Ubicamos el nombre 40px por encima de los botones
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          {imagenesData[currentImageIndex]?.imagen || 'Sin nombre'}
        </div>

        {/* Contenedor de botones flotantes en la parte inferior */}
        <div
          style={{
            position: 'fixed',
            bottom: 20, // Separación desde la parte inferior de la pantalla
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '10px', // Separación entre los botones
            zIndex: 1000, // Asegura que estén por encima del contenido
          }}
        >
          {/* Botón "Anterior" */}
          <Button
            onClick={previousImage}
            disabled={currentImageIndex === 0}
            type="primary"
          >
            Anterior
          </Button>

          {/* Botón "Siguiente" */}
          <Button
            onClick={nextImage}
            disabled={currentImageIndex === imagenesData.length - 1}
            type="primary"
          >
            Siguiente
          </Button>

          {/* Botón para cambiar el tamaño de la imagen */}
          <Button
            onClick={toggleImageSize}
            type="primary"
            icon={<ArrowsAltOutlined />}
          >
            Cambiar Tamaño
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ImagenesTable;
