import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert, Switch, Button, message, Tooltip, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'; // Icono de tacho de basura
import moment from 'moment';
import 'antd/dist/reset.css'; // Importa los estilos de Ant Design
import './formato_tabla.css';

const { confirm } = Modal;

export default function InformesPorDesbloquear() {
  const [seccionesPendientes, setSeccionesPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedSwitches, setUpdatedSwitches] = useState(new Set());

  useEffect(() => {
    fetchSeccionesPendientes();
  }, []);

  const fetchSeccionesPendientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/informes/pendientes');
      const contentType = response.headers.get('content-type');

      if (response.status === 404) {
        setError('No hay secciones pendientes para revisar.');
        setSeccionesPendientes([]);
        return;
      }

      if (!response.ok) {
        throw new Error('Error al obtener los datos. Estado: ' + response.status);
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setSeccionesPendientes(data);
      } else {
        throw new Error('Respuesta no es JSON');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = (checked, record) => {
    const updated = new Set(updatedSwitches);
    if (checked) {
      updated.add(record.id_eval);
    } else {
      updated.delete(record.id_eval);
    }
    setUpdatedSwitches(updated);
  };

  const handleSave = async () => {
    const updatePromises = Array.from(updatedSwitches).map(async (id_eval) => {
      try {
        const response = await fetch('http://localhost:3001/api/eval/update-maildisponible', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_eval }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el registro con id_eval: ' + id_eval);
        }
      } catch (err) {
        console.error(err);
      }
    });

    try {
      await Promise.all(updatePromises);
      message.success('Cambios guardados exitosamente');
      setUpdatedSwitches(new Set());
      fetchSeccionesPendientes(); // Refresca los datos de la tabla
    } catch (error) {
      message.error('Error al guardar los cambios');
    }
  };

  const confirmDelete = (id_informeseccion) => {
    confirm({
      title: '¿Estás seguro de eliminar este registro?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => handleDelete(id_informeseccion),
      onCancel: () => console.log('Cancelado'),
    });
  };

  const handleDelete = async (id_informeseccion) => {
    try {
      const response = await fetch(`http://localhost:3001/api/informes_secciones/${id_informeseccion}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el registro');
      }

      message.success('Registro eliminado exitosamente');
      fetchSeccionesPendientes(); // Actualiza la tabla después de eliminar
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      message.error('Error al eliminar el registro');
    }
  };

  const baseUrl = 'https://duoccl0-my.sharepoint.com/personal/lgutierrez_duoc_cl/Documents/SUDCRA/informes/2024002/secciones/';

  const columns = [
    { title: 'ID Informe Sección', dataIndex: 'id_informeseccion', key: 'id_informeseccion' },
    { title: 'ID Evaluación', dataIndex: 'id_eval', key: 'id_eval' },
    { title: 'Programa', dataIndex: 'programa', key: 'programa' },
    { title: 'Sede', dataIndex: 'nombre_sede', key: 'nombre_sede' },
    { title: 'Sección', dataIndex: 'seccion', key: 'seccion' },
    { 
      title: 'Marcatemporal', 
      dataIndex: 'marca_temporal', 
      key: 'marca_temporal',
      render: (fecha) => fecha ? moment(fecha).format('DD/MM/YYYY HH:mm:ss') : '-', // Formatea la fecha o muestra 'Sin fecha'
    },
    {
      title: 'ID Sección',
      dataIndex: 'id_seccion',
      key: 'id_seccion',
      render: (id_seccion) => (
        <a 
          href={`/secciones/${id_seccion}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#1890ff' }}
        >
          {id_seccion}
        </a>
      ),
    },
    { title: 'Evaluación', dataIndex: 'nombre_prueba', key: 'nombre_prueba' },
    {
      title: 'Docente',
      dataIndex: 'docente',
      key: 'docente',
      render: (docente, record) => (
        <a 
          href={`/carga-docente/${record.rut_docente}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#1890ff' }}
        >
          {docente}
        </a>
      ),
    },
    { 
      title: 'Informe',
      key: 'informe',
      render: (_, record) => (
        <a href={`${baseUrl}${record.informe}`} target="_blank" rel="noopener noreferrer">
          {record.informe}
        </a>
      ),
    },
    {
      title: 'Aprobar',
      key: 'aprobar',
      render: (_, record) => (
        <Switch 
          defaultChecked={false} 
          onChange={(checked) => handleSwitchChange(checked, record)} 
        />
      ),
    },
    {
      title: 'Eliminar',
      key: 'eliminar',
      render: (_, record) => (
        <Tooltip title="Eliminar">
          <Button danger
            icon={<DeleteOutlined className="icon-tamano1" />}
            onClick={() => confirmDelete(record.id_informeseccion)}
            style={{ color: 'red' }}
          />
        </Tooltip>
      ),
    },
  ];

  if (loading) {
    return <div><Spin /> Cargando...</div>;
  }

  if (error) {
    return <Alert message="Información" description={error} type="info" />;
  }

  if (seccionesPendientes.length === 0) {
    return (
      <Alert 
        message="No hay secciones pendientes" 
        description="No hay más secciones por revisar." 
        type="info" 
      />
    );
  }

  return (
    <div>
      <Table
        dataSource={seccionesPendientes}
        columns={columns}
        rowKey="id_informeseccion"
        pagination={false}
        className="table-small-font"
      />
      <Button 
        type="primary" 
        onClick={handleSave} 
        disabled={updatedSwitches.size === 0}
      >
        Guardar Cambios
      </Button>
    </div>
  );
}
