import React, { useState, useEffect } from 'react';
import { Table, Typography, message, Tooltip } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { LinkOutlined } from '@ant-design/icons'; // Importa el ícono de Ant Design

const columns = [
  { title: 'Código Asignatura', dataIndex: 'cod_asig', key: 'cod_asig' },
  { title: 'Nombre Prueba', dataIndex: 'nombre_prueba', key: 'nombre_prueba' },
  { title: 'ID Informe Alumno', dataIndex: 'id_informealum', key: 'id_informealum' },
  { title: 'ID Matrícula Evaluación', dataIndex: 'id_matricula_eval', key: 'id_matricula_eval' },
  {
    title: 'Marca Temporal',
    dataIndex: 'marca_temporal',
    key: 'marca_temporal',
    render: (text) => moment(text).format('DD/MM/YYYY HH:mm:ss'),
  },
  { title: 'Mail Enviado', dataIndex: 'mail_enviado', key: 'mail_enviado', render: (mail_enviado) => (mail_enviado ? 'Sí' : 'No') },
  {
    title: 'Marca Temporal de Mail',
    dataIndex: 'marca_temp_mail',
    key: 'marca_temp_mail',
    render: (text) => text ? moment(text).format('DD/MM/YYYY HH:mm:ss') : 'N/A',
  },
  {
    title: 'Informe',
    dataIndex: 'id_matricula_eval', // Este es el id que usarás para generar el enlace
    key: 'informe',
    render: (id_matricula_eval) => {
      const url = `https://duoccl0-my.sharepoint.com/personal/lgutierrez_duoc_cl/Documents/SUDCRA/informes/2024002/alumnos/${id_matricula_eval}.html`;
      return (
        <Tooltip title="Ver Informe">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'scale(1.3)' }}>
              <LinkOutlined style={{ color: '#1890ff' }} />
            </div>
          </a>
        </Tooltip>
      );
    },
  },
];

const InformesTable = ({ idMatricula }) => {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug: Mostrar el valor de idMatricula
  console.log("idMatricula en InformesTable:", idMatricula);

  useEffect(() => {
    const fetchInformes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/informes-enviados-alumno/${idMatricula}`);
        setInformes(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener los informes:', err);
        setError('Error al obtener los informes del servidor');
        message.error('Error al obtener los informes');
      } finally {
        setLoading(false);
      }
    };

    if (idMatricula) {
      fetchInformes();
    }
  }, [idMatricula]);

  // Mostrar siempre un título para verificar que el componente se renderiza
  return (
    <div style={{ marginTop: '20px' }}>
      <Typography.Title level={4}>Informes Enviados al Alumno</Typography.Title>
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
      <Table
        className="formato-table1"
        columns={columns}
        dataSource={informes}
        rowKey="id_informealum"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default InformesTable;
