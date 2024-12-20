import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert } from 'antd';
import axios from 'axios';

const UltimoIdArchivoleidoImagen = () => {
  const [data, setData] = useState(null); // Para almacenar los datos de la tabla
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const [error, setError] = useState(null); // Para manejar errores en la solicitud

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/ultimo_archivoleidoimagen');
        setData(response.data);
        setLoading(false); // Datos cargados, cambiamos el estado de carga
      } catch (err) {
        setError('Error al cargar los datos.');
        setLoading(false); // En caso de error también desactivamos la carga
      }
    };

    fetchData();
  }, []); // El useEffect solo se ejecutará una vez, al montar el componente

  // Definir las columnas de la tabla
  const columns = [
    {
      title: 'Programa',
      dataIndex: 'programa',
      key: 'programa',
    },
    {
      title: 'Último Id Archivoleido',
      dataIndex: 'id_archivoleido',
      key: 'id_archivoleido',
    },
  ];

  // Preparar los datos para la tabla
  const tableData = data
    ? [
        { programa: 'mat', id_archivoleido: data.mat },
        { programa: 'len', id_archivoleido: data.len },
        { programa: 'ing', id_archivoleido: data.ing },
        { programa: 'emp', id_archivoleido: data.emp },
        { programa: 'fyc', id_archivoleido: data.fyc },
        { programa: 'eti', id_archivoleido: data.eti },
      ]
    : [];

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <Table dataSource={tableData} columns={columns} rowKey="programa" />
      )}
    </div>
  );
};

export default UltimoIdArchivoleidoImagen;
