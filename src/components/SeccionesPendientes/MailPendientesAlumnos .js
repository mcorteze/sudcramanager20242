import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert } from 'antd';
import axios from 'axios';
import moment from 'moment';
import './formato_tabla.css';

const MailPendientesAlumnos = () => {
  const [data, setData] = useState([]); // Datos de la tabla
  const [loading, setLoading] = useState(true); // Para mostrar el estado de carga
  const [error, setError] = useState(null); // Para manejar errores

  // Definir las columnas de la tabla
  const columns = [
    {
      title: 'N°',
      dataIndex: 'n', // Columna para ID visual
      key: 'n',
    },
    {
      title: 'Código Asignatura',
      dataIndex: 'cod_asig',
      key: 'cod_asig',
    },
    {
      title: 'Nombre Prueba',
      dataIndex: 'nombre_prueba',
      key: 'nombre_prueba',
    },
    {
      title: 'Rut Alumno',
      dataIndex: 'rut',
      key: 'rut',
    },
    {
      title: 'Usuario',
      dataIndex: 'user_alum',
      key: 'user_alum',
    },
    {
      title: 'ID Matrícula',
      dataIndex: 'id_matricula',
      key: 'id_matricula',
    },
    {
      title: 'ID Evaluación',
      dataIndex: 'id_matricula_eval',
      key: 'id_matricula_eval',
    },
    {
      title: 'ID Informe',
      dataIndex: 'id_informealum',
      key: 'id_informealum',
    },
    {
      title: 'Marca Temporal',
      dataIndex: 'marca_temporal',
      key: 'marca_temporal',
      render: (fecha) => fecha ? moment(fecha).format('DD/MM/YYYY HH:mm:ss') : '-', // Formatea la fecha o muestra 'Sin fecha'
    },
    {
      title: 'Mail Enviado',
      dataIndex: 'mail_enviado',
      key: 'mail_enviado',
      render: (text) => (text ? 'Sí' : 'No'),
    },
    {
      title: 'Marca Temp Mail',
      dataIndex: 'marca_temp_mail',
      key: 'marca_temp_mail',
    },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/informes/pendientes-mail-alumnos');
        
        // Filtrar duplicados por RUT
        const uniqueData = response.data.filter((item, index, self) =>
          index === self.findIndex((t) => t.rut === item.rut)
        );

        // Agregar ID secuencial a cada registro
        const dataWithNs = uniqueData.map((item, index) => ({
          ...item,
          n: index + 1, // ID secuencial, empieza en 1
        }));

        setData(dataWithNs); // Almacenamos los datos únicos en el estado
        setLoading(false); // Terminamos de cargar
      } catch (err) {
        setError('Error al cargar los datos.');
        setLoading(false);
      }
    };

    fetchData();
  }, []); // El array vacío [] significa que este efecto solo se ejecutará una vez al cargar el componente

  if (loading) {
    return <Spin size="large" tip="Cargando..." />;
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <div>
      <h1>Informes Pendientes de Envío (con filtro de duplicados por rut)</h1>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id_informealum"
        pagination={false}
        className="table-small-font"
      />
    </div>
  );
};

export default MailPendientesAlumnos;
