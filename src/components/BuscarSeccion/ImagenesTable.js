import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table, Spin, message } from 'antd';


const ImagenesTable = ({ idSeccion }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (idSeccion) {
      fetchImagenes(idSeccion);
    }
  }, [idSeccion]);

  const fetchImagenes = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/subidasporidseccion/${id}`);
      setData(response.data);
    } catch (error) {
      message.error('Error al cargar las imágenes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Evaluación', dataIndex: 'evaluacion', key: 'evaluacion' },
    { title: 'Subida por', dataIndex: 'subidapor', key: 'subidapor' },
    { 
      title: 'ID Lista', 
      dataIndex: 'id_lista', 
      key: 'id_lista',
      render: (id_lista) => (
        <a
          href={`/imagen/${id_lista}`}
          onClick={(e) => {
            e.preventDefault(); // Evita la navegación predeterminada
            window.open(`/imagen/${id_lista}`, '_blank'); // Abre en una nueva pestaña
          }}
        >
          {id_lista}
        </a>
      ),
    },
    
  ];

  return (
    <div>
      <h2>Subida de imágenes de la sección</h2>
      {loading ? (
        <Spin tip="Cargando imágenes..." />
      ) : (
        <Table
          className='buscar-seccion-table1'
          dataSource={data}
          columns={columns}
          rowKey="id_imagen"
          pagination={ false }
        />
      )}
    </div>
  );
};

export default ImagenesTable;
