import React, { useState, useEffect } from 'react';
import { Input, Table, Button, message } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Importamos useParams

const { Search } = Input;

const ArchivoLeido = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  // Usamos useParams para obtener el parámetro id_archivoleido desde la URL
  const { id_archivoleido } = useParams();

  const fetchData = async (id_archivoleido) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/archivoleido/${id_archivoleido}`);
      setData(response.data);
      message.success('Datos cargados con éxito.');
    } catch (error) {
      console.error('Error al obtener datos:', error);
      message.error('No se pudieron cargar los datos. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    if (!value) {
      message.warning('Por favor, ingrese un ID para buscar.');
      return;
    }
    fetchData(value);
  };

  // Usamos useEffect para llamar a fetchData cuando el componente se monta o cambia el id_archivoleido
  useEffect(() => {
    if (id_archivoleido) {
      fetchData(id_archivoleido);
    }
  }, [id_archivoleido]);  // Dependencia en id_archivoleido

  const columns = [
    {
      title: 'ID Lectura',
      dataIndex: 'id_lectura',
      key: 'id_lectura',
    },
    {
      title: 'ID Archivo Leído',
      dataIndex: 'id_archivoleido',
      key: 'id_archivoleido',
    },
    {
      title: 'RUT',
      dataIndex: 'rut',
      key: 'rut',
    },
    {
      title: 'ID Matrícula Eval',
      dataIndex: 'id_matricula_eval',
      key: 'id_matricula_eval',
    },
    {
      title: 'Reproceso',
      dataIndex: 'reproceso',
      key: 'reproceso',
      render: (text) => (text ? 'Sí' : 'No'),
    },
    {
      title: 'Imagen',
      dataIndex: 'imagen',
      key: 'imagen',
      render: (text) => (text ? <a href={text} target="_blank" rel="noopener noreferrer">Ver Imagen</a> : 'No disponible'),
    },
    {
      title: 'Instante Forms',
      dataIndex: 'instante_forms',
      key: 'instante_forms',
    },
    {
      title: 'Logro Obtenido',
      dataIndex: 'logro_obtenido',
      key: 'logro_obtenido',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Buscar Archivo Leído</h2>
      <Search
        placeholder="Ingrese el ID del archivo leído"
        allowClear
        enterButton="Buscar"
        size="large"
        onSearch={handleSearch}
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        style={{ marginBottom: '20px', maxWidth: '400px' }}
      />
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id_lectura"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ArchivoLeido;
