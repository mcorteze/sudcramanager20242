import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert } from 'antd';
import 'antd/dist/reset.css';
import moment from 'moment';
import './formato_tabla.css';

export default function SeccionesMailPendientes() {
  const [seccionesMailPendientes, setSeccionesMailPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSeccionesMailPendientes();
  }, []);

  const fetchSeccionesMailPendientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/informes/pendientes-mail');
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      setSeccionesMailPendientes(data);
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Programa', dataIndex: 'programa', key: 'programa' },
    { title: 'Sede', dataIndex: 'nombre_sede', key: 'nombre_sede' },
    { title: 'Asignatura', dataIndex: 'cod_asig', key: 'cod_asig' },
    { title: 'Sección', dataIndex: 'seccion', key: 'seccion' },
    { title: 'ID Informe Sección', dataIndex: 'id_informeseccion', key: 'id_informeseccion' },
    { title: 'ID Evaluación', dataIndex: 'id_eval', key: 'id_eval' },
    {
      title: 'Marca Temporal',
      dataIndex: 'marca_temporal',
      key: 'marca_temporal',
      render: (fecha) => fecha ? moment(fecha).format('DD/MM/YYYY HH:mm:ss') : '-', // Formatea la fecha o muestra 'Sin fecha'
    },
    {
      title: 'Marca Temporal Mail',
      dataIndex: 'marca_temp_mail',
      key: 'marca_temp_mail',
      render: (fecha) => fecha ? moment(fecha).format('DD/MM/YYYY HH:mm:ss') : '-', // Formatea la fecha o muestra 'Sin fecha'
    },
    {
      title: 'Mail Enviado',
      dataIndex: 'mail_enviado',
      key: 'mail_enviado',
      render: (enviado) => (enviado ? 'Sí' : 'No'), // Muestra 'Sí' si es true, 'No' si es false
    },
  ];

  if (loading) {
    return <div><Spin /> Cargando...</div>;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  if (seccionesMailPendientes.length === 0) {
    return <Alert message="No hay secciones pendientes" description="No hay más secciones pendientes de envío de mail." type="info" />;
  }

  return (
    <div>
      <div style={{ marginTop: '20px' }}></div>
      <h1>Secciones pendientes de envío de mail</h1>
      <h3>Secciones con informe de docente pendiente por algún motivo.</h3>
      <Table
        dataSource={seccionesMailPendientes}
        columns={columns}
        rowKey="id_informeseccion"
        pagination={false}
        className="table-small-font"
      />
    </div>
  );
}
